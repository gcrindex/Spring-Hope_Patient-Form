# Deploy ke Cloudflare (agar AI Assistant tetap jalan)

AI Assistant memanggil PesatRouter **dari server** (`/api/ai/form-draft`, `/api/ai/extract-pdf`, `/api/ai/extract-image`). API key dibaca dari environment variable server (`process.env.PESATROUTER_API_KEY`). **File `.env.local` TIDAK ikut terdeploy** — jadi key harus diset di Cloudflare, bukan lewat file.

## 1. Set variabel di Cloudflare

Dashboard → **Workers & Pages** → pilih aplikasi → **Settings → Variables and Secrets** → tambah:

| Nama | Tipe | Nilai |
|---|---|---|
| `PESATROUTER_API_KEY` | **Secret** | key PesatRouter valid (mis. `sk-pesat-...`) |
| `PESATROUTER_BASE_URL` | Text | `https://api.pesatrouter.com/v1` (opsional, sudah default) |
| `PESATROUTER_MODEL` | Text | `pesat-flash` (opsional, sudah default) |

Set untuk **Production** (dan Preview jika perlu), lalu **redeploy**.

Alternatif via Wrangler CLI:

```bash
# Workers
npx wrangler secret put PESATROUTER_API_KEY
# Pages
npx wrangler pages secret put PESATROUTER_API_KEY
```

## 2. Build & deploy

Build sudah menarget Cloudflare (nitro cloudflare preset lewat `@lovable.dev/vite-tanstack-config`):

```bash
npm install   # hanya jika folder baru / belum ada node_modules
npm run build
```

Cek hasil di `.output/`:
- Kalau ada `.output/public/` (berisi `_worker.js` + aset) → deploy sebagai **Pages**:
  ```bash
  npx wrangler pages deploy .output/public
  ```
- Kalau ada `.output/server/` + `wrangler.json` (worker) → deploy sebagai **Worker**:
  ```bash
  npx wrangler deploy
  ```

## 3. Verifikasi AI jalan setelah deploy

1. Buka `https://<domain>/api/health` → harus `"pesatRouterConfigured": true`.
   - Kalau `false`: variabel belum kebaca. Pastikan nama persis `PESATROUTER_API_KEY`, diset di environment yang benar (Production), lalu redeploy.
2. Buka `/admin/new/ai`, kirim "halo" → AI harus balas chat, BUKAN langsung bikin draft.
3. Minta satu form ("buat kuesioner nyeri lutut 5 pertanyaan") → draft muncul di panel kanan.

## Catatan penting

- **Jangan pernah** prefix `VITE_` pada key — itu akan membocorkannya ke browser.
- Key lama `sk-pesat-9669...` sudah **revoked**. Setelah itu, setiap key aktif cukup disimpan di `.env.local` lokal dan di Secrets Cloudflare — jangan tulis nilai key di file/dokumen yang ikut repository.
- Timeout server ke PesatRouter 30 detik; kalau draft sering timeout di Cloudflare, pertimbangkan naikkan `30_000` di `src/routes/api.ai.form-draft.ts`.
- Local dev tetap pakai `.env.local` (sudah jalan).
