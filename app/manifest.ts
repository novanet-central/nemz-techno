import type { MetadataRoute } from "next";
import { organizationName, siteDescription } from "@/app/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: organizationName,
    short_name: "NTM",
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1ea",
    theme_color: "#941f2b",
    lang: "hu",
    icons: [
      {
        src: "/icon.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
  };
}
