type ArticleShareLinksProps = {
  articleUrl: string;
  title: string;
};

function shareUrl(endpoint: string, parameters: Record<string, string>) {
  const url = new URL(endpoint);
  url.search = new URLSearchParams(parameters).toString();
  return url.toString();
}

export function ArticleShareLinks({
  articleUrl,
  title,
}: ArticleShareLinksProps) {
  const shareLinks = [
    {
      href: shareUrl("https://www.facebook.com/sharer/sharer.php", {
        u: articleUrl,
      }),
      label: "FACEBOOK",
    },
    {
      href: shareUrl("https://x.com/intent/post", {
        text: `${title}\n${articleUrl}`,
      }),
      label: "X",
    },
    {
      href: shareUrl("https://www.linkedin.com/sharing/share-offsite/", {
        url: articleUrl,
      }),
      label: "LINKEDIN",
    },
  ];

  return (
    <section className="article-share" aria-labelledby="article-share-heading">
      <p id="article-share-heading">MEGOSZTÁS</p>
      <div>
        {shareLinks.map((link) => (
          <a
            href={link.href}
            key={link.label}
            rel="noopener noreferrer"
            target="_blank"
          >
            {link.label} <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
