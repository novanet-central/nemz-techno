import Link from "next/link";
import type { Analysis } from "@/app/lib/analyses";

type AnalysisCardProps = {
  analysis: Analysis;
  index: number;
};

export function AnalysisCard({ analysis, index }: AnalysisCardProps) {
  return (
    <article className="analysis-card">
      <div className="card-meta">
        <span>{analysis.category}</span>
        <time>{analysis.date}</time>
      </div>
      <div className="article-number">{String(index + 1).padStart(2, "0")}</div>
      <h3>{analysis.title}</h3>
      <p>{analysis.summary}</p>
      <Link className="card-link" href={`/elemzesek/${analysis.slug}`}>
        ELEMZÉS MEGNYITÁSA <span aria-hidden="true">↗</span>
      </Link>
      <span className="read-time">{analysis.readTime}</span>
    </article>
  );
}
