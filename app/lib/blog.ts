import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { BlogPost, BlogPostPreview } from "@/app/lib/blog-shared";

export {
  formatPostDate,
  getBlogPostPath,
  getPostDateSegment,
  getReadingTime,
  slugify,
} from "@/app/lib/blog-shared";

type BlogRow = {
  created_at: string;
  id: string;
  intro: string;
  published: boolean;
  tags: unknown;
  text: string;
  title: string;
  updated_at: string;
};

const PREVIEW_FIELDS = "id,title,intro,tags,created_at,updated_at";
const POST_FIELDS = `${PREVIEW_FIELDS},text`;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Published blog access is not configured.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

function normalizeCategories(value: unknown) {
  const rawCategories = Array.isArray(value)
    ? value.filter((category): category is string => typeof category === "string")
    : typeof value === "string"
      ? [value]
      : [];
  const seenCategories = new Set<string>();

  return rawCategories
    .flatMap((category) => category.split(","))
    .map((category) => category.trim())
    .filter((category) => {
      const normalizedCategory = category.toLocaleLowerCase("hu-HU");

      if (!normalizedCategory || seenCategories.has(normalizedCategory)) {
        return false;
      }

      seenCategories.add(normalizedCategory);
      return true;
    });
}

function toPostPreview(row: Omit<BlogRow, "published" | "text">): BlogPostPreview {
  return {
    created_at: row.created_at,
    id: row.id,
    intro: row.intro,
    categories: normalizeCategories(row.tags),
    title: row.title,
    updatedAt: row.updated_at,
  };
}

function toPost(row: BlogRow): BlogPost {
  return {
    ...toPostPreview(row),
    text: row.text,
  };
}

function throwBlogQueryError(operation: string, code: string) {
  console.error(`Published blog ${operation} failed.`, { code });
  throw new Error("Published blog content could not be loaded.");
}

export async function getPublishedBlogPostPreviews(limit?: number) {
  const query = getSupabaseClient()
    .from("technocrat_blog")
    .select(PREVIEW_FIELDS)
    .eq("published", true)
    .order("created_at", { ascending: false });
  const { data, error } = await (limit ? query.limit(limit) : query);

  if (error) {
    throwBlogQueryError("list query", error.code);
  }

  return (data ?? []).map((row) => toPostPreview(row as Omit<BlogRow, "published" | "text">));
}

export async function getPublishedBlogPost(id: string) {
  if (!UUID_PATTERN.test(id)) {
    return null;
  }

  const { data, error } = await getSupabaseClient()
    .from("technocrat_blog")
    .select(POST_FIELDS)
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    throwBlogQueryError("detail query", error.code);
  }

  return data ? toPost(data as BlogRow) : null;
}

export async function getRelatedPublishedBlogPostPreviews(post: BlogPost) {
  if (post.categories.length === 0) {
    return [];
  }

  const postCategories = new Set(
    post.categories.map((category) => category.toLocaleLowerCase("hu-HU")),
  );
  const posts = await getPublishedBlogPostPreviews();

  return posts
    .filter((candidate) => candidate.id !== post.id)
    .filter((candidate) =>
      candidate.categories.some((category) =>
        postCategories.has(category.toLocaleLowerCase("hu-HU")),
      ),
    )
    .slice(0, 3);
}
