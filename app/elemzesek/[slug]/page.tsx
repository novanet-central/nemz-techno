import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { analyses } from "@/app/lib/analyses";

type AnalysisPageProps = PageProps<"/elemzesek/[slug]">;

const articleSections = [
  {
    label: "01 / FORRÁSOK",
    title: "Források",
    content:
      "Az elemzés nyilvános intézményi dokumentumok, többoldalú források, piaci adatok és szakmai értelmezések összevetésére épül. A tényállítások és a következtetések minden esetben elkülönülnek.",
  },
  {
    label: "02 / TÉNYEK",
    title: "Tények",
  },
  {
    label: "03 / ÖSSZEFÜGGÉSEK",
    title: "Összefüggések",
    content:
      "A vizsgált folyamatot nem önmagában, hanem a tágabb intézményi, gazdasági és biztonságpolitikai környezetében érdemes értelmezni. A döntési helyzeteket a szereplők eltérő képességei és ösztönzői alakítják.",
  },
  {
    label: "04 / MAGYAR SZEMPONT",
    title: "Magyar szempont",
    content:
      "A magyar stratégiai relevancia az ellátásbiztonság, a döntési autonómia és a hosszú távú alkalmazkodóképesség oldaláról értelmezhető. A mozgástér bővítése többirányú kapcsolatokat és kiszámítható intézményi működést feltételez.",
  },
  {
    label: "05 / KÖVETKEZTETÉS",
    title: "Következtetés",
    content:
      "A jó stratégiai döntés nem reagál minden zajra, de világosan megkülönbözteti a tartós szerkezeti változásokat a rövid távú ingadozásoktól. A következtetések értékét a végrehajthatóság és a bizonytalanságok nyílt jelzése adja.",
  },
];

export function generateStaticParams() {
  return analyses.map((analysis) => ({ slug: analysis.slug }));
}

export async function generateMetadata({
  params,
}: AnalysisPageProps): Promise<Metadata> {
  const { slug } = await params;
  const analysis = analyses.find((item) => item.slug === slug);

  if (!analysis) {
    return {};
  }

  return {
    title: `${analysis.title} | Nemzeti Technokrata Műhely`,
    description: analysis.summary,
  };
}

export default function AnalysisPage({ params }: AnalysisPageProps) {
  return (
    <>
      <SiteHeader activePage="analyses" />

      <main>
        <Suspense fallback={<p className="archive-loading">ELEMZÉS BETÖLTÉSE…</p>}>
          <AnalysisContent params={params} />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}

async function AnalysisContent({
  params,
}: Pick<AnalysisPageProps, "params">) {
  const { slug } = await params;
  const analysis = analyses.find((item) => item.slug === slug);

  if (!analysis) {
    notFound();
  }

  const relatedAnalyses = analyses
    .filter((item) => item.category === analysis.category && item.slug !== analysis.slug)
    .slice(0, 3);

  return (
    <article>
      <header className="article-header">
        <Link className="article-back" href="/elemzesek">← ELEMZÉSEKHEZ</Link>
        <div className="article-meta">
          <span>{analysis.category}</span>
          <time>{analysis.date}</time>
          <span>{analysis.readTime}</span>
        </div>
        <h1>{analysis.title}</h1>
        <p>{analysis.summary}</p>
      </header>

      <div className="article-layout">
        <div className="article-body">
          {articleSections.map((section) => (
            <section key={section.title}>
              <p className="eyebrow">{section.label}</p>
              <h2>{section.title}</h2>
              <p>{section.content ?? analysis.summary}</p>
            </section>
          ))}
        </div>

        <aside className="article-aside">
          {relatedAnalyses.length > 0 && (
            <section>
              <p className="eyebrow">KAPCSOLÓDÓ ELEMZÉSEK</p>
              <div className="related-analyses">
                {relatedAnalyses.map((related) => (
                  <Link href={`/elemzesek/${related.slug}`} key={related.slug}>
                    <span>{related.date}</span>
                    {related.title}
                    <i aria-hidden="true">↗</i>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}
