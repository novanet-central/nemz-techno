export type BlogPostPreview = {
  categories: string[];
  created_at: string;
  id: string;
  intro: string;
  title: string;
  updatedAt: string;
};

export type BlogPost = BlogPostPreview & {
  text: string;
};

export function formatCategory(category: string) {
  const value = category.trim();

  return value
    ? `${value.charAt(0).toLocaleUpperCase("hu-HU")}${value.slice(1)}`
    : "";
}

export function formatCategories(categories: string[]) {
  return categories.map(formatCategory).filter(Boolean).join(", ");
}

export function matchesCategory(category: string, value: string) {
  return category.trim().toLocaleLowerCase("hu-HU") === value.trim().toLocaleLowerCase("hu-HU");
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getPostDateSegment(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.valueOf())) {
    throw new Error(`Invalid blog post creation date: ${createdAt}`);
  }

  return date.toISOString().slice(0, 10);
}

export function getBlogPostPath(post: Pick<BlogPostPreview, "created_at" | "id" | "title">) {
  return `/elemzesek/${getPostDateSegment(post.created_at)}/${slugify(post.title)}/${post.id}`;
}

export function formatPostDate(createdAt: string) {
  return new Intl.DateTimeFormat("hu-HU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));
}

export function getReadingTime(content: string) {
  const wordCount = content
    .replace(/::(?:youtube|x)\[[\s\S]*?\]/g, "")
    .replace(/[#*_`[\]()]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return `${Math.max(1, Math.ceil(wordCount / 220))} PERC OLVASÁS`;
}
