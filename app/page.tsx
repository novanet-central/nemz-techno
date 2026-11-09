import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AnalysisCard } from "@/app/components/AnalysisCard";
import { ContactForm } from "@/app/components/ContactForm";
import { JsonLd } from "@/app/components/JsonLd";
import { NewsletterForm } from "@/app/components/NewsletterForm";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getPublishedBlogPostPreviews } from "@/app/lib/blog";
import {
  absoluteUrl,
  organizationId,
  organizationName,
  siteDescription,
} from "@/app/lib/site";

const topics = [
  { label: "GEOPOLITIKA", filter: "GEOPOLITIKA" },
  { label: "EURÓPAI UNIÓ", filter: "EURÓPAI UNIÓ" },
  { label: "ENERGIABIZTONSÁG", filter: "ENERGIABIZTONSÁG" },
  { label: "GAZDASÁGI SZUVERENITÁS", filter: "GAZDASÁGI SZUVERENITÁS" },
  { label: "KÖZÉP-EURÓPA", filter: "KÖZÉP-EURÓPA" },
  { label: "VÉDELEM ÉS STRATÉGIA", filter: "VÉDELMI STRATÉGIA" },
];

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: "/",
    siteName: organizationName,
    title: organizationName,
    description: siteDescription,
  },
};

export default function Home() {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl("/")}#webpage`,
    name: organizationName,
    description: siteDescription,
    url: absoluteUrl("/"),
    inLanguage: "hu-HU",
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    about: { "@id": organizationId },
  };

  return (
    <>
      <SiteHeader activePage="home" />

      <main id="top">
        <JsonLd data={homeSchema} />
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">GEOPOLITIKAI ÉS STRATÉGIAI ELEMZŐ MŰHELY</p>
            <h1>
              Magyar érdek.
              <br />
              <em>Tárgyilagos elemzés.</em>
            </h1>
            <p className="hero-lede">
              Nemzetközi folyamatok, következmények és döntési helyzetek
              magyar szemszögből. Adatokra, forrásokra és világos
              összefüggésekre építve.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#elemzesek">LEGFRISSEBB ELEMZÉSEK <span>↓</span></a>
              <a className="text-link" href="#modszer">HOGYAN DOLGOZUNK <span>→</span></a>
            </div>
          </div>
          <div className="hero-signal" aria-hidden="true">
            <Image
              className="hero-signal-image"
              src="/nt-i.png"
              alt=""
              fill
              sizes="(max-width: 820px) 0px, 30vw"
            />
          </div>
        </section>

        <section className="statement-band" aria-label="Műhely jelmondat">
          <p>KÖVETKEZTETÉSEK <em>A ZAJON TÚL</em></p>
        </section>

        <section className="analyses section" id="elemzesek">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / PUBLIKÁCIÓK</p>
              <h2>Friss elemzések</h2>
            </div>
            <Link className="text-link" href="/elemzesek">ÖSSZES ELEMZÉS <span>→</span></Link>
          </div>
          <Suspense fallback={<p className="archive-loading">ELEMZÉSEK BETÖLTÉSE…</p>}>
            <FeaturedAnalysisGrid />
          </Suspense>
        </section>

        <section className="practice section" id="modszer">
          <div className="practice-intro">
            <p className="eyebrow">02 / MÓDSZER</p>
            <h2>Nem véleményeket<br />gyártunk. <em>Értelmezünk.</em></h2>
            <p>
              A tények, a források és a következtetések nem ugyanazt jelentik.
              Munkánkban ezeket minden esetben elkülönítjük.
            </p>
            {/* <a className="button button-outline" href="#modszer-reszletesen">MÓDSZERTANUNK <span>→</span></a> */}
          </div>
          <ol className="practice-list">
            <li>
              <span>01</span>
              <div><h3>FELTÁRUNK</h3><p>Elsődleges és többoldalú forrásokat vetünk össze.</p></div>
            </li>
            <li>
              <span>02</span>
              <div><h3>ÖSSZEVETÜNK</h3><p>Az eseményt a tágabb politikai, gazdasági és intézményi térben értelmezzük.</p></div>
            </li>
            <li>
              <span>03</span>
              <div><h3>KÖVETKEZTETÜNK</h3><p>Megnevezzük a magyar stratégiai relevanciát és az ismert bizonytalanságokat.</p></div>
            </li>
          </ol>
        </section>

        <section className="topics section" id="temak">
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 / TÉMAKÖRÖK</p>
              <h2>Stratégiai fókusz</h2>
            </div>
            <p className="section-note">Azok a területek, ahol a világfolyamatok<br />közvetlenül érintik a magyar döntési teret.</p>
          </div>
          <div className="topic-list">
            {topics.map((topic, index) => (
              <Link href={`/elemzesek?tema=${encodeURIComponent(topic.filter)}`} key={topic.label}>
                <span>0{index + 1}</span>
                <strong>{topic.label}</strong>
                <i aria-hidden="true">→</i>
              </Link>
            ))}
          </div>
        </section>

        <section className="principle" id="rolunk">
          <h2 className="principle-section-title">Alapelvek</h2>
          <div className="principle-content">
            <div className="principle-tenets">
              <article className="principle-tenet">
                <p className="eyebrow">ALAPELV / 01</p>
                <h2>A magyar érdek nem hangulatkérdés.</h2>
              </article>
              <article className="principle-tenet">
                <p className="eyebrow">ALAPELV / 02</p>
                <h2>A szuverenitás nem jelszó. <strong>Működőképesség.</strong></h2>
              </article>
            </div>
            <div className="principle-about">
              <p>
              A Nemzeti Technokrata Műhely független szerkesztőségi
              kezdeményezés. Célunk, hogy a magyar stratégiai mozgásteret
              tárgyilagosan, pártpolitikai kötöttségek nélkül vizsgáljuk.
              </p>
              <Link className="text-link" href="/rolunk">A MŰHELYRŐL <span>→</span></Link>
            </div>
          </div>
        </section>

        <section className="subscribe">
          <div className="section-heading">
            <h2>Hírlevél</h2>
          </div>
          <NewsletterForm />
        </section>

        <section className="contact section" id="kapcsolat">
          <div className="section-heading">
            <h2>Kapcsolatfelvétel</h2>
          </div>
          <ContactForm
            turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
        </section>

      </main>

      <SiteFooter />
    </>
  );
}

async function FeaturedAnalysisGrid() {
  const analyses = await getPublishedBlogPostPreviews(3);

  if (analyses.length === 0) {
    return <p className="archive-loading">JELENLEG NINCS PUBLIKÁLT ELEMZÉS.</p>;
  }

  return (
    <div className="analysis-grid">
      {analyses.map((analysis, index) => (
        <AnalysisCard analysis={analysis} index={index} key={analysis.id} />
      ))}
    </div>
  );
}
