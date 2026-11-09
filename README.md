This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Kapcsolatfelvételi űrlap

Másold a [.env.example](./.env.example) fájlt `.env.local` néven, majd add meg az értékeket a célkörnyezethez. A titkos változókat kizárólag a telepítési szolgáltató titkos környezeti változóiban tárold; ne add őket a repositoryhoz.

- A lábléc közösségi linkjeihez állítsd be a `NEXT_PUBLIC_FACEBOOK_URL` és `NEXT_PUBLIC_TWITTER_URL` teljes, `https://` kezdetű URL-jét. Az üres vagy érvénytelen értékhez nem jelenik meg link.
- A `CONTACT_ALLOWED_ORIGIN` a helyi fejlesztéshez `http://localhost:3000`, élesben `https://www.nemzetitechnokrata.hu`.
- A Gmail API-t engedélyezni kell a Google Cloud projektben. A `GOOGLE_OAUTH_REFRESH_TOKEN` a `CONTACT_SENDER_EMAIL` postaládához kiadott, offline OAuth token legyen, amely csak a `https://www.googleapis.com/auth/gmail.send` scope-ot kapta.
- A `CONTACT_SENDER_EMAIL` csak olyan cím lehet, amelyről a hitelesített Google-fiók küldhet levelet.
- A Turnstile site key publikus, a secret key kizárólag szerveroldali. Mindkettőt a Cloudflare Turnstile dashboardon létrehozott widgetből vedd át.

### Cloudflare Turnstile kulcsok

1. Nyisd meg a [Cloudflare dashboard Turnstile oldalát](https://dash.cloudflare.com/?to=/:account/turnstile).
2. Válaszd az **Add widget** lehetőséget, adj neki beszédes nevet, és a widget típusának hagyd a **Managed** értéket.
3. Engedélyezett hostnévként add meg a `www.nemzetitechnokrata.hu` címet. Helyi fejlesztéshez add hozzá a `localhost` hostnevet is.
4. A létrehozott widgetnél másold ki a **Sitekey** értéket a `NEXT_PUBLIC_TURNSTILE_SITE_KEY` változóba, a **Secret key** értéket pedig a `TURNSTILE_SECRET_KEY` változóba.

A site key szándékosan publikus, de a secret key nem kerülhet kliensoldali kódba, Gitbe vagy hibaüzenetbe.

### Google Gmail API OAuth értékek

1. A [Google Cloud Console-ban](https://console.cloud.google.com/) hozz létre vagy válassz egy kizárólag ehhez a webhelyhez használt projektet.
2. Az **APIs & Services > Library** alatt engedélyezd a **Gmail API**-t.
3. Az **APIs & Services > OAuth consent screen** oldalon Workspace-fiókhoz válaszd az **Internal** közönséget. A scope-ok közül csak a `https://www.googleapis.com/auth/gmail.send` jogosultságot add hozzá.
4. Az **APIs & Services > Credentials > Create credentials > OAuth client ID** alatt hozz létre **Web application** típusú klienst. A létrejött értékek a `GOOGLE_OAUTH_CLIENT_ID` és a `GOOGLE_OAUTH_CLIENT_SECRET`.
5. Egyszeri refresh-token kiállításhoz ideiglenesen add hozzá az `https://developers.google.com/oauthplayground` címet az OAuth kliens **Authorized redirect URIs** listájához.
6. Nyisd meg a [Google OAuth 2.0 Playgroundot](https://developers.google.com/oauthplayground/), a beállításoknál jelöld be a **Use your own OAuth credentials** lehetőséget, és add meg az előző lépésben kapott client ID-t és client secretet.
7. A bal oldali scope mezőbe írd be a `https://www.googleapis.com/auth/gmail.send` értéket, majd válaszd az **Authorize APIs** lehetőséget. A `szerkesztoseg@nemzetitechnokrata.hu` postaládával jelentkezz be, és hagyd jóvá a kizárólag küldésre vonatkozó jogosultságot.
8. Az **Exchange authorization code for tokens** lépés után a megjelenő **Refresh token** érték a `GOOGLE_OAUTH_REFRESH_TOKEN`. Az access token rövid életű, azt nem kell eltárolni.
9. A refresh token kiállítása után töröld az OAuth Playground redirect URI-t, ha a futó alkalmazás nem használ saját OAuth visszahívási útvonalat.

A `GOOGLE_OAUTH_CLIENT_SECRET` és a `GOOGLE_OAUTH_REFRESH_TOKEN` csak a hoszting szolgáltató titkos környezeti változóiban szerepelhet. Ne küldd el e-mailben vagy chatben, és ne add hozzá `.env` fájlban sem a Githez.

## Beágyazások az elemzésekben

Az elemzések szövegében a tagek önálló sorban szerepeljenek:

```text
::youtube[VIDEO_ID]
::x[https://x.com/account/status/POST_ID]
```

Mindkét tag az oldalon belül jelenik meg. A YouTube videó a privacy-központú `youtube-nocookie.com` lejátszót használja, az X bejegyzés pedig az X hivatalos widgetjével töltődik be.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
