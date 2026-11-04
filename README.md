# Arif & Suchana | Kabin Ceremony

**Phase 1: The opening invitation experience.**

A mobile-first, animated invitation for **Arif Rahman & Suchana Sarker**. It opens with a floral card, changes the visitor's tap into a butterfly, and reveals the couple's illustration through a flight of white doves.

## Included in Phase 1

- **Opening invitation card:** `A & S`, `Kabin Ceremony`, and a click/tap hint.
- **Butterfly interaction:** appears at the visitor's click/tap location.
- **White dove flight:** layered birds glide across the screen as the card fades away.
- **Hero reveal:** the finalized couple illustration and their names.
- **Accessibility:** keyboard activation, reduced-motion preference, and a replay button.
- **Phone-first responsive styling** with no music or tracking.

The final wedding date, venue, Google Maps links, Quranic verses, and RSVP will be added in later phases. This version intentionally does not invent or display those details.

## Local development

Install [Node.js 22 LTS](https://nodejs.org/) or a version compatible with Next.js 16, then:

```bash
npm install
npm run dev
```

Open http://localhost:3000. To validate a production build:

```bash
npm run build
```

## Deploy to Vercel (when ready)

1. Import GitHub repository `alvy007/ArifBhaiWeadingCard` in Vercel.
2. Vercel should detect **Next.js** automatically.
3. Select the `main` branch and deploy. No environment variables are required in Phase 1.
4. After deployment, pushing new commits to `main` can trigger automatic production redeployment once the GitHub integration is connected.

## Project structure

```text
app/
  globals.css          # Floral card, transitions, and mobile/desktop styling
  layout.tsx           # Metadata
  page.tsx             # Entry point
components/
  WeddingExperience.tsx  # Intro → butterfly → white doves → hero state machine
public/
  arif-suchana.webp    # Final couple illustration (public-facing asset)
```

## Customization

The first-screen title, couple names, and animation timings are defined in `components/WeddingExperience.tsx`. The colors and motion are in `app/globals.css`.

**Artwork:** The supplied and approved A & S couple illustration is intended for the couple's invitation site. The original private portrait photographs are not included in this public repository.
