# GameController DEMO

Modern esports match & team tracker for VALORANT and CS2. Live matches, upcoming schedules, team pages, and follow lists in a single, fast App Router experience.

## Özellikler

- Gerçek zamanlı maç takibi (live/upcoming/completed)
- Takım listesi, takım detayları ve takip sistemi
- Oyun bazlı filtreler (Valorant / CS2)
- Takımlar için gelişmiş filtreler (platform, Valorant bölge filtresi)
- Gelişmiş kartlar, animasyonlar ve responsive grid
- API fallback verileri (scrape başarısız olursa)

## Veri Kaynakları

- VLR: https://vlr.orlandomm.net/api/v1
- HLTV: https://hltv-api.vercel.app/api

> Not: Bu kaynaklar üçüncü taraf topluluk API’leridir. Uptime ve veri formatı değişiklik gösterebilir.

## Teknoloji Yığını

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Radix UI + Shadcn UI bileşenleri
- Zustand (client state)
- Framer Motion (animasyon)

## Sayfalar

- / → Landing (live matches, featured teams, games)
- /matches → Maç listesi
- /match/[id] → Maç detayı
- /teams → Takım listesi + filtre paneli
- /team/[id] → Takım detayı
- /tournaments → Turnuva listesi

## API Rotaları

- /api/matches
- /api/match/[id]
- /api/teams
- /api/team/[id]

## Kurulum

Ön koşullar: Node.js 18+ önerilir.

```bash
npm install
npm run dev
```

Uygulama: http://localhost:3000

## Scriptler

- dev: Next.js dev server
- build: production build
- start: production server
- lint: ESLint

## Ortam Değişkenleri

Bu proje için zorunlu bir .env tanımı yoktur.

## Deployment

Vercel üzerinde doğrudan deploy edilebilir. App Router ile uyumludur.
