import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link className="wordmark footer-wordmark" href="/">
          <Image className="logo-mark" src="/ntm-symbol.svg" alt="" width={32} height={32} />
          <span className="wordmark-type">
            NEMZETI<b>TECHNOKRATA</b><i>MŰHELY</i>
          </span>
        </Link>
        <p>Stratégiai gondolkodás Magyarország számára.</p>
        <a href="mailto:szerkesztoseg@nemzetitechnokrata.hu">szerkesztoseg@nemzetitechnokrata.hu</a>
      </div>
      <div className="footer-bottom">
        <span>© 2026 NEMZETI TECHNOKRATA MŰHELY</span>
        <div><Link href="/#adatkezeles">ADATKEZELÉS</Link><Link href="/#jogi">JOGI NYILATKOZAT</Link></div>
        <span>BUDAPEST / HU</span>
      </div>
    </footer>
  );
}
