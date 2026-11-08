"use client";

import { useEffect, useState } from "react";
import { AnalysisCard } from "@/app/components/AnalysisCard";
import type { BlogPostPreview } from "@/app/lib/blog-shared";

const MOBILE_BREAKPOINT = 820;

type AnalysisArchiveProps = {
  analyses: BlogPostPreview[];
};

export function AnalysisArchive({ analyses }: AnalysisArchiveProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 6 : 9;
  const totalPages = Math.ceil(analyses.length / itemsPerPage);
  const activePage = Math.min(currentPage, totalPages);
  const firstItemIndex = (activePage - 1) * itemsPerPage;
  const visibleAnalyses = analyses.slice(firstItemIndex, firstItemIndex + itemsPerPage);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  return (
    <>
      {visibleAnalyses.length > 0 ? (
        <div className="analysis-grid">
          {visibleAnalyses.map((analysis, index) => (
            <AnalysisCard
              analysis={analysis}
              index={firstItemIndex + index}
              key={analysis.id}
            />
          ))}
        </div>
      ) : (
        <p className="archive-loading">JELENLEG NINCS PUBLIKÁLT ELEMZÉS.</p>
      )}

      {totalPages > 1 && (
        <nav className="analysis-pagination" aria-label="Elemzések lapozása">
          <p>
            OLDAL <strong>{activePage}</strong> / {totalPages}
          </p>
          <div>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => page - 1)}
              disabled={activePage === 1}
            >
              ← ELŐZŐ
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <button
                  type="button"
                  aria-current={page === activePage ? "page" : undefined}
                  className={page === activePage ? "active" : undefined}
                  key={page}
                  onClick={() => setCurrentPage(page)}
                >
                  {String(page).padStart(2, "0")}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setCurrentPage((page) => page + 1)}
              disabled={activePage === totalPages}
            >
              KÖVETKEZŐ →
            </button>
          </div>
        </nav>
      )}
    </>
  );
}
