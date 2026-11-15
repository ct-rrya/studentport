# CTU Student & Campus Portal — Tech Stack

## 1. Core Framework & Language
- **Next.js `16.4.6`** (App Router, Server Components, Route Handlers; built/dev-served with `--webpack`)
- **React `19.3.0`** & **React DOM `19.3.0`**
- **TypeScript `^5`** (`strict: true`, path alias `@/*` -> `./src/*`)
- **Node.js `v22+`** runtime for server-side ingestion scripts and API routes

## 2. Styling & UI
- **Tailwind CSS `4.3.3`** via **`@tailwindcss/postcss` `^4.3.5`** (`postcss.config.mjs`, `src/app/globals.css`)
- **Lucide React `^1.73.0`** for UI icons
- **CTU Theme Palette:** Deep Navy (`#0f2447`), Maroon (`#7a1c24`), and Gold (`#d4a017`) over a neutral `#f8fafc` surface
- **State Persistence:** React Context (`src/context/CampusContext.tsx`) backed by `useSyncExternalStore` + `localStorage` for the global 29-campus filter

## 3. Data Ingestion, Parsing & Sanitization
- **WordPress REST API v2:** Primary sync source (`https://www.ctu.edu.ph/wp-json/wp/v2/posts?_embed&per_page=30` and `/pages?per_page=30`) via Node's `node:https`
- **`rss-parser` `^3.13.0`:** Automatic fallback to `https://www.ctu.edu.ph/feed/` if the WP REST API is unavailable
- **`cheerio` `^1.2.0`:** HTML sanitization (`src/lib/sanitize.ts`), entity decoding, excerpt extraction, and downloadable memo/form link scraping
- **`tsx` `^4.23.15`:** Runs the standalone CLI sync script (`scripts/sync-ctu.ts` via `npm run sync`)
- **Auto-Tagging Engine:** Word-boundary keyword matching (`matchCampusesInText` in `src/data/campuses.ts`) across all 29 CTU campuses (1 Main, 16 Satellite, 12 Extension)

## 4. Storage & Caching Layer
- **Local JSON Cache (Default):** `data/cache.json` managed by `src/lib/cache.ts`
- **Supabase PostgreSQL (Optional):** PostgREST integration in `src/lib/cache.ts` (`ctu_portal_cache` table defined in `supabase/schema.sql`) activated automatically when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- **Zero Direct Client Fetching:** All external `ctu.edu.ph` fetches run strictly server-side; the frontend reads only from cached data and internal `/api/*` routes

## 5. AI Assistant (RAG Chatbot)
- **Google Gemini API via `@google/genai` `^3.3.0`** (`src/app/api/chat/route.ts`)
- **Model:** `gemini-3.5-flash-lite` (overridable via `GEMINI_MODEL`)
- **Grounding Pipeline (`src/lib/chat-rag.ts`):** Lightweight keyword + active-campus retrieval over cached `ctu.edu.ph` announcements, the 29-campus directory, academic programs, and official CTU URLs
- **Widget UI (`src/components/CtuChatbot.tsx`):** Floating `"Ask CTU AI"` panel with quick-start chips, campus badge awareness, and lightweight Markdown/link rendering

## 6. Social Feed Integration
- **Meta Official Facebook Page Plugin (`<iframe>`)** (`src/components/FacebookFeedEmbed.tsx`)
  - Uses `https://www.facebook.com/plugins/page.php` with `loading="lazy"`, `max-w-[500px]` responsive wrapper, and `"Open on Facebook"` fallback links
  - Dynamically resolves campus-specific pages (`facebookUrl`) or falls back to `https://www.facebook.com/ctuofficial`

## 7. API Endpoints & Scripts
| Endpoint / Script | Purpose | Auth / Protection |
| --- | --- | --- |
| `npm run dev` | Start local dev server (`next dev --webpack`) | — |
| `npm run build` | Production build (`next build --webpack`) | — |
| `npm run lint` | Run ESLint (`eslint-config-next`) | — |
| `npm run sync` | CLI sync (`tsx scripts/sync-ctu.ts`) | Server/CLI only |
| `GET /api/news` | Filter cached posts (`campus`, `category`, `q`) | Public (cache-only) |
| `GET / POST /api/sync` | Check sync status or trigger server sync | `SYNC_SECRET` (`x-sync-secret` / Bearer) |
| `POST /api/chat` | Grounded Gemini student assistant | Server-side `GEMINI_API_KEY` |

## 8. Environment Variables (`.env.example`)
- `SYNC_SECRET` — Secret protecting `POST /api/sync`
- `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY` — Optional remote cache persistence
- `GEMINI_API_KEY` & `GEMINI_MODEL` — Server-side Gemini API key and model override
