import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/app/components/JsonLd";
import {
  absoluteUrl,
  organizationId,
  organizationName,
  siteDescription,
  siteUrl,
} from "@/app/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: organizationName,
    template: `%s | ${organizationName}`,
  },
  description: siteDescription,
  applicationName: organizationName,
  authors: [{ name: organizationName, url: siteUrl }],
  creator: organizationName,
  publisher: organizationName,
  category: "Geopolitikai és stratégiai elemzés",
  keywords: [
    "geopolitika",
    "stratégiai elemzés",
    "Magyarország",
    "energiabiztonság",
    "Közép-Európa",
  ],
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: "/",
    siteName: organizationName,
    title: organizationName,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: organizationName,
    description: siteDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const siteSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: organizationName,
      url: siteUrl,
      logo: absoluteUrl("/icon.png"),
      email: "szerkesztoseg@nemzetitechnokrata.hu",
      description: siteDescription,
      inLanguage: "hu-HU",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: organizationName,
      url: siteUrl,
      inLanguage: "hu-HU",
      publisher: { "@id": organizationId },
    },
  ];

  return (
    <html
      lang="hu"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={siteSchema} />
        {children}
      </body>
    </html>
  );
}
