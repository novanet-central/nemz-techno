export const siteHostname = "www.nemzetitechnokrata.hu";
export const siteUrl = `https://${siteHostname}`;
export const organizationName = "Nemzeti Technokrata Műhely";
export const siteDescription =
  "Geopolitikai és stratégiai elemző műhely: tárgyilagos elemzés magyar szemszögből.";
export const organizationId = `${siteUrl}/#organization`;

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
