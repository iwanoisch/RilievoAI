# SEO/SEM Checklist - RilievoAI

## Pagine Pubbliche

| Route | Pagina | Descrizione |
|-------|--------|-------------|
| `/` | HomePage | Landing page principale |
| `/login` | Login | Pagina di accesso |
| `/invitation?token=...` | InvitationPage | Registrazione collaboratore |
| `/collab/:collabId` | InvitationPage | Accettazione invito via mail |

---

## CRITICO (impatto diretto su indicizzazione)

- [x] **1. Meta description mancante** _(risolto)_
  - File: `index.html`
  - Aggiunto: `<meta name="description">` + `<meta name="keywords">` + `<meta name="author">`

- [x] **2. Tag `<title>` generico** _(risolto)_
  - File: `index.html`
  - Aggiornato a: "RilievoAI - Rilievo Edilizio Assistito da AI"

- [x] **3. Nessuna sitemap.xml** _(risolto)_
  - File: `public/sitemap.xml`
  - Aggiunto: sitemap con `/` e `/login`, hreflang alternates per homepage

- [x] **4. robots.txt troppo restrittivo** _(risolto)_
  - File: `public/robots.txt`
  - Aggiornato: Allow per `/js/`, `/assets/`, `/images/` + Disallow espliciti per route autenticate + riferimento sitemap

- [x] **5. Nessun tag canonical** _(risolto)_
  - File: `index.html`
  - Aggiunto: `<link rel="canonical" href="https://app.rilievoai.it/">`

---

## ALTO (impatto su visibilita e CTR)

- [x] **6. Open Graph / Twitter Card mancanti** _(risolto)_
  - File: `index.html`
  - Aggiunto: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image` (con dimensioni e alt), `og:locale` (it + alternate en/ar), `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
  - **NOTA:** Serve creare l'immagine `public/images/og-image.png` (1200x630px)

- [x] **7. SPA senza pre-rendering** _(risolto)_
  - File: `index.html`
  - Aggiunto: contenuto statico della HomePage dentro `<div id="root">` con HTML semantico (`<section>`, `<main>`, `<h1>`, `<h2>`, `<dl>`). React sovrascrive al mount

- [x] **8. Nessun dato strutturato (JSON-LD)** _(risolto)_
  - File: `index.html`
  - Aggiunto: schema `SoftwareApplication` con `Organization` come author

- [x] **9. Testi hardcoded in italiano nella HomePage** _(risolto)_
  - File: `HomePage.tsx`, `it/translation.json`, `en/translation.json`, `ar/translation.json`
  - Aggiunte 10 chiavi i18n: `new_version`, `learn_more`, `cta_login`, `cta_features`, `features_subtitle`, `feature_planning`, `feature_planning_desc`, `feature_materials`, `feature_materials_desc`, `feature_reports`, `feature_reports_desc`

---

## MEDIO (qualita tecnica e UX)

- [x] **10. Nessun hreflang** _(risolto)_
  - File: `index.html`
  - Aggiunto: `<link rel="alternate" hreflang="it/en/ar/x-default">`

- [ ] **11. Link morti (`href="#"`)**
  - Pagine pubbliche:
    - `HomePage.tsx:29` — "Scopri di piu" nel banner "Nuova versione"
    - `Login.tsx:118` — "Password dimenticata?"
    - `Login.tsx:154` — "Vai alla Dashboard" (usa href="#" + onClick)
    - `Login.tsx:170` — "Contatta l'amministratore"
    - `InvitationPage.tsx:354-355` — "Termini di servizio" / "Privacy policy"
  - Pagine protette (basso impatto SEO):
    - `Pagination.tsx:117`
    - `sub-menu-bar.tsx:10-38` (multipli)
  - Fix: rimuovere link, sostituire con destinazioni reali, o aggiungere `rel="nofollow"`

- [x] **12. Nessuna pagina 404** _(risolto)_
  - File: `src/pages/not-found/NotFound.tsx`, `src/AppRouting.tsx`
  - Aggiunto: pagina 404 con gradient brand, testo i18n (it/en/ar), pulsante "Torna alla home", route catch-all `*`
  - Nota: visibile solo per utenti loggati. Utenti non loggati vengono reindirizzati a `/` dal Layout (comportamento corretto)

- [x] **13. HTML semantico carente** _(risolto)_
  - File: `HomePage.tsx`
  - Sostituiti `<div>` con: `<section>` (hero + features), `<header>` (titolo/sottotitolo), `<nav>` (CTA), `<article>` (feature cards), `aria-labelledby` sulla sezione features

- [x] **14. Manifest.json mancante** _(risolto)_
  - File: `public/favicon/site.webmanifest`, `index.html`
  - Aggiunto: manifest con nome, descrizione, theme_color, icone maskable 192x192 e 512x512 da RealFaviconGenerator

---

## BASSO (ottimizzazioni aggiuntive)

- [x] **15. Preconnect/prefetch** _(risolto)_
  - File: `index.html`
  - Aggiunto: `preconnect` per `fonts.googleapis.com` e `fonts.gstatic.com` (unica risorsa esterna caricata su ogni pagina)

- [x] **16. Favicon e apple-touch-icon** _(risolto)_
  - File: `index.html`, `public/favicon/`
  - Aggiunto da RealFaviconGenerator: `favicon.ico`, `favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`, icone manifest 192x192 e 512x512

- [x] **17. Meta theme-color mancante** _(risolto)_
  - File: `index.html`
  - Aggiunto: `<meta name="theme-color" content="#F28F16">`

- [x] **18. Performance hints mancanti** _(risolto)_
  - File: `index.html`
  - Aggiunto: `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`

---

## Da fare manualmente

- [ ] Creare immagine `public/images/og-image.png` (1200x630px) per anteprime social
- [x] ~~Verificare/aggiornare URL canonical e OG se il dominio non e `app.rilievoai.it`~~ _(dominio confermato)_
- [ ] Aggiornare i dati strutturati JSON-LD (prezzo, categoria) quando disponibili
