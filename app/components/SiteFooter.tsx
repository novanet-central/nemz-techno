import Image from "next/image";
import Link from "next/link";

type SocialLink = {
  href: string;
  label: string;
};

function getSocialLink(
  value: string | undefined,
  label: string,
): SocialLink | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Unsupported protocol");
    }

    return { href: url.toString(), label };
  } catch {
    console.error(`Invalid ${label} URL configuration.`);
    return undefined;
  }
}

export function SiteFooter() {
  const socialLinks = [
    getSocialLink(process.env.NEXT_PUBLIC_FACEBOOK_URL, "Facebook"),
    getSocialLink(process.env.NEXT_PUBLIC_TWITTER_URL, "X/Twitter"),
  ].filter((link): link is SocialLink => link !== undefined);

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link className="wordmark footer-wordmark" href="/">
            <Image className="logo-mark" src="/ntm-symbol.svg" alt="" width={32} height={32} />
            <span className="wordmark-type">
              NEMZETI<b>TECHNOKRATA</b><i>MŰHELY</i>
            </span>
          </Link>
          {socialLinks.length > 0 && (
            <div className="footer-social-links" aria-label="Közösségi média">
              {socialLinks.map((link) => (
                <a
                  href={link.href}
                  key={link.label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
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
