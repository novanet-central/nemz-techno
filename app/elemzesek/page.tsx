import Link from "next/link";
import { Suspense } from "react";
import { AnalysisArchive } from "@/app/components/AnalysisArchive";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { analyses } from "@/app/lib/analyses";

type AnalysesPageProps = PageProps<"/elemzesek">;

export default function AnalysesPage({
  searchParams,
}: AnalysesPageProps) {
  return (
    <>
      <SiteHeader activePage="analyses" />

      <main>
        <section className="archive-intro">
          <p className="eyebrow">PUBLIKÁCIÓK / ARCHÍVUM</p>
          <h1>Elemzések</h1>
          <p>
            Nemzetközi folyamatok, stratégiai összefüggések és magyar
            relevanciák tárgyilagos értelmezése.
          </p>
        </section>

        <section className="archive section" id="elemzesek">
          <Suspense fallback={<p className="archive-loading">ELEMZÉSEK BETÖLTÉSE…</p>}>
            <FilteredAnalysisArchive searchParams={searchParams} />
          </Suspense>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

async function FilteredAnalysisArchive({
  searchParams,
}: Pick<AnalysesPageProps, "searchParams">) {
  const { tema } = await searchParams;
  const selectedTopic =
    typeof tema === "string" &&
    analyses.some((analysis) => analysis.category === tema)
      ? tema
      : undefined;
  const filteredAnalyses = selectedTopic
    ? analyses.filter((analysis) => analysis.category === selectedTopic)
    : analyses;

  return (
    <>
      {selectedTopic && (
        <div className="archive-filter">
          <p><span>AKTÍV SZŰRŐ</span>{selectedTopic}</p>
          <Link href="/elemzesek">SZŰRÉS TÖRLÉSE <span>→</span></Link>
        </div>
      )}
      <AnalysisArchive analyses={filteredAnalyses} />
    </>
  );
}
