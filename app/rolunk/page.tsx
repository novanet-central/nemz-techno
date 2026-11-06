import Link from "next/link";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";

export default function AboutPage() {
  return (
    <>
      <SiteHeader activePage="about" />

      <main>
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
