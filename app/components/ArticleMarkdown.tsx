import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { XPostEmbed } from "@/app/components/XPostEmbed";

type ContentSegment =
  | { content: string; type: "markdown" }
  | { type: "x"; postUrl: string }
  | { type: "youtube"; videoId: string };

const EMBED_DIRECTIVE =
  /::youtube\[([A-Za-z0-9_-]{11})\]|::x\[\[(https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/[^\s\]]+\/status\/\d+(?:\?[^\s\]]*)?)\]\]\([^)]*\)\]?|::x\[(https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/[^\s\]]+\/status\/\d+(?:\?[^\s\]]*)?)\]/g;

function toXPostUrl(value: string) {
  try {
    const url = new URL(value);
    const validHost = ["x.com", "www.x.com", "twitter.com", "www.twitter.com"].includes(url.hostname);
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (!validHost || pathParts.length < 3 || pathParts[1] !== "status" || !/^\d+$/.test(pathParts[2])) {
      return null;
    }

    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function splitContent(content: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let cursor = 0;

  for (const match of content.matchAll(EMBED_DIRECTIVE)) {
    const matchIndex = match.index ?? 0;
    const markdown = content.slice(cursor, matchIndex);

    if (markdown.trim()) {
      segments.push({ content: markdown, type: "markdown" });
    }

    const [, videoId, bracketedXPostUrl, simpleXPostUrl] = match;
    const xPostUrl = bracketedXPostUrl ?? simpleXPostUrl;

    if (videoId) {
      segments.push({ type: "youtube", videoId });
    } else if (xPostUrl) {
      const postUrl = toXPostUrl(xPostUrl);

      if (postUrl) {
        segments.push({ postUrl, type: "x" });
      } else {
        segments.push({ content: match[0], type: "markdown" });
      }
    }

    cursor = matchIndex + match[0].length;
  }

  const remainingMarkdown = content.slice(cursor);

  if (remainingMarkdown.trim()) {
    segments.push({ content: remainingMarkdown, type: "markdown" });
  }

  return segments;
}

function MarkdownSegment({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ children, href }) => {
          const isExternal = href?.startsWith("https://") || href?.startsWith("http://");

          return (
            <a href={href} rel={isExternal ? "noreferrer" : undefined} target={isExternal ? "_blank" : undefined}>
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="article-embed-youtube">
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title="YouTube-videó"
      />
    </div>
  );
}

export function ArticleMarkdown({ content }: { content: string }) {
  const segments = splitContent(content);

  return (
    <div className="article-markdown">
      {segments.map((segment, index) => {
        if (segment.type === "youtube") {
          return <YouTubeEmbed key={`${segment.videoId}-${index}`} videoId={segment.videoId} />;
        }

        if (segment.type === "x") {
          return <XPostEmbed key={`${segment.postUrl}-${index}`} postUrl={segment.postUrl} />;
        }

        return <MarkdownSegment content={segment.content} key={`markdown-${index}`} />;
      })}
    </div>
  );
}
