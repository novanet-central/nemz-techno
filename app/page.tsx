import Image from "next/image";
import Link from "next/link";
import { AnalysisCard } from "@/app/components/AnalysisCard";
import { NewsletterForm } from "@/app/components/NewsletterForm";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { featuredAnalyses } from "@/app/lib/analyses";

const topics = [
  { label: "GEOPOLITIKA", filter: "GEOPOLITIKA" },
  { label: "EURÓPAI UNIÓ", filter: "EURÓPAI UNIÓ" },
  { label: "ENERGIABIZTONSÁG", filter: "ENERGIABIZTONSÁG" },
  { label: "GAZDASÁGI SZUVERENITÁS", filter: "GAZDASÁGI SZUVERENITÁS" },
  { label: "KÖZÉP-EURÓPA", filter: "KÖZÉP-EURÓPA" },
  { label: "VÉDELEM ÉS STRATÉGIA", filter: "VÉDELMI STRATÉGIA" },
];

export default function Home() {
  return (
    <>
      <SiteHeader activePage="home" />

      <main id="top">
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
          <div className="analysis-grid">
            {featuredAnalyses.map((article, index) => (
              <AnalysisCard analysis={article} index={index} key={article.title} />
            ))}
          </div>
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
          <form className="contact-form">
            <div className="contact-fields">
              <label htmlFor="contact-email">
                E-MAIL CÍM
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="nev@pelda.hu"
                  autoComplete="email"
                />
              </label>
              <label htmlFor="contact-phone">
                TELEFONSZÁM
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder="+36 30 123 4567"
                  autoComplete="tel"
                />
              </label>
            </div>
            <div className="contact-form-footer">
              <p>
                Az üzenetküldés beállítás alatt áll. A kapcsolatfelvételi
                végpont Google Cloudon keresztül kerül bekötésre.
              </p>
              <button type="button" disabled>KÜLDÉS HAMAROSAN <span>→</span></button>
            </div>
          </form>
        </section>

      </main>

      <SiteFooter />
    </>
  );
}
