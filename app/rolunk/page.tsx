import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/app/components/JsonLd";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { absoluteUrl, organizationId, organizationName } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "A műhelyről",
  description:
    "A Nemzeti Technokrata Műhely küldetése, elemzési szemlélete és geopolitikai-stratégiai fókuszterületei.",
  alternates: {
    canonical: "/rolunk",
  },
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: "/rolunk",
    siteName: organizationName,
    title: "A műhelyről",
    description:
      "A Nemzeti Technokrata Műhely küldetése, elemzési szemlélete és geopolitikai-stratégiai fókuszterületei.",
  },
  twitter: {
    card: "summary_large_image",
    title: "A műhelyről",
    description:
      "A Nemzeti Technokrata Műhely küldetése, elemzési szemlélete és geopolitikai-stratégiai fókuszterületei.",
    images: ["/opengraph-image"],
  },
};

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${absoluteUrl("/rolunk")}#about`,
    name: "A Nemzeti Technokrata Műhelyről",
    description: metadata.description,
    url: absoluteUrl("/rolunk"),
    inLanguage: "hu-HU",
    mainEntity: { "@id": organizationId },
  };

  return (
    <>
      <SiteHeader activePage="about" />

      <main>
        <JsonLd data={aboutSchema} />
        <section className="about-intro">
          <p className="eyebrow">A MŰHELYRŐL</p>
          <h1>Stratégiai gondolkodás.<br /><em>Magyar nézőpontból.</em></h1>
          <p>
            A Nemzeti Technokrata Műhely független szerkesztőségi kezdeményezés.
            A magyar stratégiai mozgásteret tárgyilagosan, pártpolitikai
            kötöttségek nélkül vizsgáljuk.
          </p>
        </section>

        <section className="about-purpose">
          <div>
            <p className="eyebrow">01 / MIÉRT LÉTEZÜNK</p>
            <h2>Nem hangulatot<br />keltünk. <em>Értelmezünk.</em></h2>
          </div>
          <div className="about-purpose-copy">
            <p>
              A nemzetközi folyamatok értelmezéséhez nem elegendő a napi
              hírek követése. Az események mögött működő gazdasági,
              intézményi és biztonságpolitikai összefüggéseket is látni kell.
            </p>
            <p>
              Munkánk célja, hogy ezekből a folyamatokból világos, magyar
              szempontból is értelmezhető következtetések szülessenek.
            </p>
          </div>
        </section>

        <section className="about-purpose about-topics">
          <div>
            <p className="eyebrow">02 / TÉMÁINK</p>
            <h2>Azok a kérdések,<br />amelyek <em>alakítják</em><br />a mozgásteret.</h2>
          </div>
          <div className="about-topics-list">
            <Link href="/elemzesek?tema=GEOPOLITIKA">GEOPOLITIKA <span>→</span></Link>
            <Link href="/elemzesek?tema=EURÓPAI%20UNIÓ">EURÓPAI UNIÓ <span>→</span></Link>
            <Link href="/elemzesek?tema=ENERGIABIZTONSÁG">ENERGIABIZTONSÁG <span>→</span></Link>
            <Link href="/elemzesek?tema=KÖZÉP-EURÓPA">KÖZÉP-EURÓPA <span>→</span></Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
