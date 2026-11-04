# Panduan Instalasi SIMONKEU Kanwil BPN Sulsel

Dua bagian: **backend** (Google Apps Script, berkas `Kode.gs`, diberikan terpisah) dan **frontend** (folder ini, di-deploy ke GitHub Pages).

## A. Backend (Google Apps Script)

1. Buka https://script.google.com → **Proyek baru**.
2. Ganti nama berkas `Code.gs` menjadi `Kode`, lalu tempel seluruh isi `Kode.gs`.
3. Pilih fungsi `setupAppEnvironment` → **Run**. Izinkan akses Spreadsheet dan Drive.
4. Buka **Execution log** dan **catat sekarang** dua baris `AKUN admin` dan `AKUN tamu` beserta sandi awalnya. Sandi hanya tampil sekali. Setup aman dijalankan ulang; sandi dan rahasia yang sudah ada tidak ditimpa.
5. **Deploy → Deployment baru → Aplikasi web**: *Execute as* **Me**, *Who has access* **Anyone**. Salin URL yang berakhiran `/exec`.
6. Jangan menambah editor proyek Apps Script sembarangan: editor dapat melihat Script Properties (tempat hash sandi dan rahasia sesi disimpan).

Lupa sandi: jalankan `resetSandi('admin')` dari editor (sandi acak baru muncul di log) atau `resetSandi('admin','SandiBaru123')`. Keluarkan semua sesi: jalankan `rotasiSecretSesi()`.

## B. Frontend (GitHub Pages)

1. Ekstrak ZIP. Folder hasil ekstraksi (`simonkeu-sulsel`) **adalah folder yang di-push**. Di dalamnya harus langsung terlihat `index.html`, `css/`, dan `js/`.
2. Buka `js/config.js`, ganti `GANTI_DENGAN_ID_DEPLOYMENT` dengan URL `/exec` dari langkah A5.
3. Buka PowerShell/Terminal **di dalam folder itu**, lalu cek `dir` (Windows) atau `ls` (Mac/Linux): `index.html` harus muncul di daftar.
4. Buat repository kosong di GitHub (publik), lalu jalankan (ganti `USERNAME` dan `NAMA-REPO`):

```
git init
git add .
git commit -m "SIMONKEU awal"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

Jika diminta sandi, pakai *Personal Access Token* GitHub (bukan sandi akun).
5. Di GitHub: **Settings → Pages → Deploy from branch → main / (root)**. Tunggu 1–2 menit, lalu buka `https://USERNAME.github.io/NAMA-REPO/`.
6. Update berikutnya: ubah berkas, lalu `git add .`, `git commit -m "update"`, `git push`.

## C. Pengisian data pertama (login sebagai `admin`)

1. **Admin → Impor master**: unggah `database_sulsel.xlsx`.
2. **Admin → Impor realisasi**: unggah berkas “Realisasi FA berdasarkan SP2D” (±12.000 baris, dikirim bertahap, tunggu hingga muncul “Selesai”).
3. **Admin → Blokir**: isi blokir per satker bila ada (berkas SP2D tidak memuat blokir).
4. **Admin → Ubah kata sandi saya**: ganti sandi awal. Sandi akun `tamu` diganti dari editor Apps Script lewat `resetSandi('tamu','SandiBaru123')`.

## D. Catatan

- Setiap kali backend diubah, buat **deployment baru** (atau kelola deployment → versi baru) agar perubahan aktif.
- Impor realisasi mengganti seluruh baris lama; bila terputus di tengah jalan, ulangi impor dari awal.
- Tombol **Cetak / simpan PDF** membuka dialog cetak browser; pilih “Simpan sebagai PDF”.
- Data tersimpan di spreadsheet “Database SIMONKEU Kanwil BPN Sulsel” (sheet Realisasi, Satker, RO, Blokir, Log, Meta). Jangan membagikan spreadsheet itu secara luas.
