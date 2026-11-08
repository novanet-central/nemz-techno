import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AnalysisArchive } from "@/app/components/AnalysisArchive";
import { JsonLd } from "@/app/components/JsonLd";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getPublishedBlogPostPreviews } from "@/app/lib/blog";
import {
  formatCategory,
  getBlogPostPath,
  matchesCategory,
} from "@/app/lib/blog-shared";
import { absoluteUrl, organizationId, organizationName } from "@/app/lib/site";

type AnalysesPageProps = PageProps<"/elemzesek">;

export const metadata: Metadata = {
  title: "Elemzések",
  description:
    "Geopolitikai és stratégiai elemzések nemzetközi folyamatokról, magyar relevanciákkal és tárgyilagos következtetésekkel.",
  alternates: {
    canonical: "/elemzesek",
  },
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: "/elemzesek",
    siteName: organizationName,
    title: "Elemzések",
    description:
      "Geopolitikai és stratégiai elemzések nemzetközi folyamatokról, magyar relevanciákkal és tárgyilagos következtetésekkel.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elemzések",
    description:
      "Geopolitikai és stratégiai elemzések nemzetközi folyamatokról, magyar relevanciákkal és tárgyilagos következtetésekkel.",
    images: ["/opengraph-image"],
  },
};

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
  const analyses = await getPublishedBlogPostPreviews();
  const selectedTopic =
    typeof tema === "string" &&
    tema.trim().length > 0
      ? tema
      : undefined;
  const filteredAnalyses = selectedTopic
    ? analyses.filter((analysis) =>
        analysis.categories.some((category) => matchesCategory(category, selectedTopic)),
      )
    : analyses;
  const archiveSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/elemzesek")}#collection`,
    name: "Elemzések",
    description: metadata.description,
    url: absoluteUrl("/elemzesek"),
    inLanguage: "hu-HU",
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    publisher: { "@id": organizationId },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: filteredAnalyses.length,
      itemListElement: filteredAnalyses.map((analysis, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(getBlogPostPath(analysis)),
        name: analysis.title,
      })),
    },
  };

  return (
    <>
      <JsonLd data={archiveSchema} />
      {selectedTopic && (
        <div className="archive-filter">
          <p><span>AKTÍV SZŰRŐ</span>{formatCategory(selectedTopic)}</p>
          <Link href="/elemzesek">SZŰRÉS TÖRLÉSE <span>→</span></Link>
        </div>
      )}
      <AnalysisArchive analyses={filteredAnalyses} />
    </>
  );
}
