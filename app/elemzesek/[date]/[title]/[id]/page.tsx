import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { ArticleMarkdown } from "@/app/components/ArticleMarkdown";
import { ArticleShareLinks } from "@/app/components/ArticleShareLinks";
import { JsonLd } from "@/app/components/JsonLd";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import {
  getPublishedBlogPost,
  getRelatedPublishedBlogPostPreviews,
} from "@/app/lib/blog";
import {
  formatCategories,
  formatPostDate,
  getBlogPostPath,
  getReadingTime,
  getPostDateSegment,
  slugify,
} from "@/app/lib/blog-shared";
import {
  absoluteUrl,
  organizationId,
  organizationName,
} from "@/app/lib/site";

type AnalysisPageProps = PageProps<"/elemzesek/[date]/[title]/[id]">;

export async function generateMetadata({
  params,
}: AnalysisPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPublishedBlogPost(id);

  if (!post) {
    return {
      robots: {
        follow: false,
        index: false,
      },
    };
  }

  const canonicalPath = getBlogPostPath(post);

  return {
    title: post.title,
    description: post.intro,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      locale: "hu_HU",
      url: canonicalPath,
      siteName: organizationName,
      title: post.title,
      description: post.intro,
      publishedTime: post.created_at,
      modifiedTime: post.updatedAt,
      authors: [organizationName],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.intro,
      images: ["/opengraph-image"],
    },
  };
}

export default function AnalysisPage(props: AnalysisPageProps) {
  return (
    <>
      <SiteHeader activePage="analyses" />

      <main>
        <Suspense fallback={<p className="archive-loading">ELEMZÉS BETÖLTÉSE…</p>}>
          <AnalysisContent {...props} />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}

async function AnalysisContent({ params }: AnalysisPageProps) {
  const { date, id, title } = await params;
  const post = await getPublishedBlogPost(id);

  if (!post) {
    notFound();
  }

  const canonicalPath = getBlogPostPath(post);

  if (date !== getPostDateSegment(post.created_at) || title !== slugify(post.title)) {
    permanentRedirect(canonicalPath);
  }

  const relatedPosts = await getRelatedPublishedBlogPostPreviews(post);
  const articleUrl = absoluteUrl(canonicalPath);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    headline: post.title,
    description: post.intro,
    url: articleUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    datePublished: post.created_at,
    dateModified: post.updatedAt,
    articleSection: formatCategories(post.categories) || "Elemzés",
    keywords: post.categories.join(", "),
    inLanguage: "hu-HU",
    isAccessibleForFree: true,
    author: { "@id": organizationId },
    publisher: { "@id": organizationId },
    image: absoluteUrl("/opengraph-image"),
  };

  return (
    <article>
      <JsonLd data={articleSchema} />
      <header className="article-header">
        <Link className="article-back" href="/elemzesek">← ELEMZÉSEKHEZ</Link>
        <div className="article-meta">
          <span>{formatCategories(post.categories) || "Elemzés"}</span>
          <time dateTime={post.created_at}>{formatPostDate(post.created_at)}</time>
          <span>{getReadingTime(post.text)}</span>
        </div>
        <h1>{post.title}</h1>
        <p>{post.intro}</p>
      </header>

      <div className={`article-layout${relatedPosts.length === 0 ? " article-layout-wide" : ""}`}>
        <div className="article-body">
          <ArticleMarkdown content={post.text} />
          <ArticleShareLinks articleUrl={articleUrl} title={post.title} />
        </div>

        {relatedPosts.length > 0 && (
          <aside className="article-aside">
            <section>
              <p className="eyebrow">KAPCSOLÓDÓ ELEMZÉSEK</p>
              <div className="related-analyses">
                {relatedPosts.map((related) => (
                  <Link href={getBlogPostPath(related)} key={related.id}>
                    <span>{formatPostDate(related.created_at)}</span>
                    {related.title}
                    <i aria-hidden="true">↗</i>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        )}
      </div>
    </article>
  );
}
