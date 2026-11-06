export type Analysis = {
  category: string;
  date: string;
  readTime: string;
  slug: string;
  summary: string;
  title: string;
};

type AnalysisSource = Omit<Analysis, "slug">;

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const analysisSources: AnalysisSource[] = [
  {
    category: "ENERGIABIZTONSÁG",
    date: "2026. NOV. 05.",
    title: "Az energiapiac új realitása: kiszolgáltatottság vagy mozgástér?",
    summary:
      "A globális energiapiac átrendeződése nem lezárt folyamat. Magyarország számára a rugalmasság és a többirányú kapcsolat jelenti a valódi biztonságot.",
    readTime: "8 PERC OLVASÁS",
  },
  {
    category: "KÖZÉP-EURÓPA",
    date: "2026. NOV. 02.",
    title: "A közép-európai tér új súlya az európai döntéshozatalban",
    summary:
      "A régió gazdasági és biztonságpolitikai érdekei egyre világosabban formálnak közös pozíciót az uniós vitákban.",
    readTime: "6 PERC OLVASÁS",
  },
  {
    category: "VÉDELMI STRATÉGIA",
    date: "2026. OKT. 28.",
    title: "A védelem nem importcikk: képesség, ipar, döntési autonómia",
    summary:
      "A védelmi képesség nem kizárólag költségvetési tétel, hanem hosszú távú intézményi és iparpolitikai döntés.",
    readTime: "10 PERC OLVASÁS",
  },
  {
    category: "EURÓPAI UNIÓ",
    date: "2026. OKT. 21.",
    title: "Versenyképesség vagy koordináció: az uniós iparpolitika új dilemmája",
    summary:
      "A stratégiai iparágak támogatása csak akkor erősíti Európát, ha a tagállami mozgástér és a közös piac egyensúlyban marad.",
    readTime: "7 PERC OLVASÁS",
  },
  {
    category: "GAZDASÁGI SZUVERENITÁS",
    date: "2026. OKT. 16.",
    title: "Tőke, technológia, döntés: hol kezdődik a gazdasági önrendelkezés?",
    summary:
      "A külső finanszírozás és a hazai döntési képesség viszonya meghatározza a hosszú távú növekedési pályát.",
    readTime: "9 PERC OLVASÁS",
  },
  {
    category: "GEOPOLITIKA",
    date: "2026. OKT. 10.",
    title: "A nagyhatalmi verseny köztes tere: mit jelent ez egy nyitott gazdaságnak?",
    summary:
      "A blokkosodó világgazdaságban a kapcsolatok diverzifikálása nem taktikai, hanem stratégiai feladat.",
    readTime: "8 PERC OLVASÁS",
  },
  {
    category: "ENERGIABIZTONSÁG",
    date: "2026. OKT. 03.",
    title: "Tárolókapacitás és ellátásbiztonság: a rendszer kevésbé látható oldala",
    summary:
      "Az ellátásbiztonságot nem egyetlen forrás, hanem az infrastruktúra, a tartalékok és az előrejelezhetőség együtt adja.",
    readTime: "6 PERC OLVASÁS",
  },
  {
    category: "KÖZÉP-EURÓPA",
    date: "2026. SZEPT. 26.",
    title: "Régiós együttműködés: érdekközösség a változó európai térben",
    summary:
      "A közép-európai országok közötti együttműködés értéke akkor nő, amikor az egyes nemzeti érdekek mellett közös gyakorlati cél is kirajzolódik.",
    readTime: "7 PERC OLVASÁS",
  },
  {
    category: "VÉDELMI STRATÉGIA",
    date: "2026. SZEPT. 18.",
    title: "A védelmi ipar mint nemzetgazdasági képesség",
    summary:
      "A beszerzési döntések önmagukban nem teremtenek képességet: a tudás, a beszállítói kör és az intézményi tanulás is része a rendszernek.",
    readTime: "9 PERC OLVASÁS",
  },
  {
    category: "EURÓPAI UNIÓ",
    date: "2026. SZEPT. 11.",
    title: "Döntési sebesség és demokratikus felhatalmazás az uniós vitákban",
    summary:
      "A gyorsabb európai döntéshozatal iránti igény csak akkor fenntartható, ha a tagállami legitimáció és az elszámoltathatóság is erősödik.",
    readTime: "8 PERC OLVASÁS",
  },
  {
    category: "GAZDASÁGI SZUVERENITÁS",
    date: "2026. SZEPT. 04.",
    title: "Beszállítói hálózatok és ellenálló gazdaság",
    summary:
      "A gazdasági ellenállóképesség a kritikus ellátási láncok átláthatóságával, nem pedig az önellátás illúziójával kezdődik.",
    readTime: "7 PERC OLVASÁS",
  },
  {
    category: "GEOPOLITIKA",
    date: "2026. AUG. 28.",
    title: "Forgatókönyvek bizonytalanságban: hogyan érdemes stratégiai kockázatot olvasni?",
    summary:
      "A jó helyzetértékelés nem jóslat, hanem az ismert tények, a lehetséges következmények és a bizonytalanságok világos szétválasztása.",
    readTime: "10 PERC OLVASÁS",
  },
];

export const analyses: Analysis[] = analysisSources.map((analysis) => ({
  ...analysis,
  slug: slugify(analysis.title),
}));

export const featuredAnalyses = analyses.slice(0, 3);
