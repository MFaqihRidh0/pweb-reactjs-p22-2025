# IT Literature Shop • Modul 4 (React + TypeScript)

Website katalog & transaksi buku terhubung REST API dari modul sebelumnya.

## Fitur Utama
- Autentikasi: Login, Register, Logout (token `localStorage`), setelah login diarahkan ke `/books`, navbar menampilkan email user.
- Manajemen Buku (protected): 
  - Daftar buku + **search**, **filter by condition**, **sort by title/publish date**, **pagination** (client-side).
  - Detail buku (`/books/:id`).
  - Tambah buku (dropdown genre dari `/genres`).
  - Hapus buku (konfirmasi).
- Transaksi (protected):
  - **Checkout** ">1 item" dari keranjang.
  - Daftar transaksi + **search by id**, **sort by id/amount/price**, **pagination**.
  - Detail transaksi (`/transactions/:id`).
- UX: loading, error, empty state; validasi form; responsif mobile/desktop.
- (Optional) Dukungan `image_url` untuk buku; komponen reusable (button/input/select/card/pagination/spinner/alert).

## Menjalankan
1. Pastikan backend modul sebelumnya aktif (contoh: `http://localhost:3000`).
2. Duplikasi `.env.example` menjadi `.env` lalu atur:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
3. Install & jalan:
   ```bash
   npm install
   npm run dev
   ```

## Catatan Integrasi API
- Diasumsikan endpoint berikut tersedia:
  - `POST /auth/register`, `POST /auth/login` ⇒ `{ access_token }`
  - `GET /auth/me` ⇒ profil user (email)
  - `GET /genres`
  - `GET /books`, `GET /books/:id`, `POST /books`, `DELETE /books/:id`
  - `GET /transactions`, `GET /transactions/:id`, `POST /transactions`
- Jika skema berbeda, sesuaikan di folder `src/api/*`.
- Pagination pada daftar memanfaatkan client-side; bila backend mendukung query `?page=&limit=&search=...`, Anda dapat mengubah `src/pages/*` untuk memanggil endpoint tersebut.

## Struktur
```
src/
  api/               # axios client + wrapper endpoint
  components/        # komponen UI reusable
  context/           # Auth & Cart context
  pages/             # halaman utama (route)
  styles/            # CSS global
  types/             # tipe TypeScript
```
