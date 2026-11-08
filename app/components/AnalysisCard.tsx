import Link from "next/link";
import {
  formatCategories,
  formatPostDate,
  getBlogPostPath,
  type BlogPostPreview,
} from "@/app/lib/blog-shared";

type AnalysisCardProps = {
  analysis: BlogPostPreview;
  index: number;
};

export function AnalysisCard({ analysis, index }: AnalysisCardProps) {
  return (
    <article className="analysis-card">
      <div className="card-meta">
        <span>{formatCategories(analysis.categories) || "Elemzés"}</span>
        <time dateTime={analysis.created_at}>{formatPostDate(analysis.created_at)}</time>
      </div>
      <div className="article-number">{String(index + 1).padStart(2, "0")}</div>
      <h3>{analysis.title}</h3>
      <p>{analysis.intro}</p>
      <Link className="card-link" href={getBlogPostPath(analysis)}>
        ELEMZÉS MEGNYITÁSA <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
