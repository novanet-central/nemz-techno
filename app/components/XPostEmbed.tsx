"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

type XPostEmbedProps = {
  postUrl: string;
};

export function XPostEmbed({ postUrl }: XPostEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null);
  const renderEmbed = useCallback(() => {
    window.twttr?.widgets?.load(embedRef.current ?? undefined);
  }, []);

  useEffect(() => {
    renderEmbed();
  }, [renderEmbed, postUrl]);

  return (
    <div className="article-embed-x" ref={embedRef}>
      <blockquote className="twitter-tweet">
        <a href={postUrl}>{postUrl}</a>
      </blockquote>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={renderEmbed}
      />
    </div>
  );
}
