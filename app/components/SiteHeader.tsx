import Image from "next/image";
import Link from "next/link";

type ActivePage = "home" | "analyses" | "about";

type SiteHeaderProps = {
  activePage?: ActivePage;
};

const navigationItems: Array<{ href: string; label: string; page?: ActivePage }> = [
  { href: "/", label: "KEZDŐLAP", page: "home" },
  { href: "/elemzesek", label: "ELEMZÉSEK", page: "analyses" },
  { href: "/#temak", label: "TÉMÁK" },
  { href: "/#modszer", label: "MÓDSZERTAN" },
  { href: "/rolunk", label: "RÓLUNK", page: "about" },
];

export function SiteHeader({ activePage }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Nemzeti Technokrata Műhely kezdőlap">
        <Image className="logo-mark" src="/ntm-symbol.svg" alt="" width={32} height={32} priority />
        <span className="wordmark-type">
          NEMZETI
          <b>TECHNOKRATA</b>
          <i>MŰHELY</i>
        </span>
      </Link>
      <nav className="main-nav" aria-label="Fő navigáció">
        {navigationItems.map((item) => (
          <Link className={item.page === activePage ? "active" : undefined} href={item.href} key={item.label}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="header-contact" href="/#kapcsolat">
        KAPCSOLAT <span aria-hidden="true">↗</span>
      </Link>
    </header>
  );
}
