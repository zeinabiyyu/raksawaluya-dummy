# RAKSAWALUYA — Website Profil Jembatan

Website statis dengan visualisasi Raksawaluya, animasi, eksplorasi struktur, dan dashboard simulasi. Semua gambar dan font disertakan secara lokal. Tidak membutuhkan React, npm, database, atau proses build.

## Cara paling cepat membuka

1. Ekstrak ZIP terlebih dahulu.
2. Buka folder `raksawaluya-website`.
3. Klik dua kali `index.html` menggunakan Chrome, Edge, Firefox, atau Safari modern.

Website dapat berjalan tanpa internet. Pastikan seluruh folder `assets` tetap berada di samping `index.html`. Membuka file dari dalam tampilan ZIP tanpa ekstraksi dapat menyebabkan gambar tidak tampil.

## Menjalankan dengan server lokal

Opsional, jika Python 3 tersedia:

```bash
cd raksawaluya-website
python3 -m http.server 8080 --bind 127.0.0.1
```

Di Windows, gunakan `python` sebagai pengganti `python3`, atau klik `jalankan-windows.bat`. Di macOS/Linux, jalankan `bash jalankan-lokal.sh`. Buka `http://localhost:8080` lalu hentikan server dengan Ctrl+C. Server lokal hanya digunakan untuk melihat website, bukan menerima laporan.

## Yang sudah tersedia

- Desain responsif dengan warna arang, krem, dan oranye.
- Hero visual Raksawaluya, efek kedalaman saat scroll, dan mode siang–malam.
- Animasi masuk, pita teks bergerak, hotspot berdenyut, dan interaksi hover.
- Menu seluler, indikator posisi scroll, dan navigasi bagian aktif.
- Eksplorasi empat sudut gambar jembatan dengan tiga hotspot penjelasan.
- Dashboard enam indikator: air, suhu, angin, getaran, arus kendaraan, dan kelembapan.
- Grafik canvas responsif dengan tooltip, pergantian parameter, dan 60 sampel.
- Skenario normal, air naik, dan air tinggi; indikator berubah sesuai ambang contoh.
- Tombol jeda/lanjutkan pembaruan sensor.
- Accordion tiga gagasan inovasi.
- Galeri dengan filter, dialog pembesaran, navigasi panah, dan dukungan keyboard.
- Formulir tervalidasi yang membuat pratinjau dan mengunduh laporan `.txt`.
- Skip link, fokus keyboard, label tombol, dialog native, dan dukungan preferensi pengurangan gerak.
- Favicon serta gambar dan font lokal.

## Batas fungsi yang perlu dipahami

Dashboard menggunakan **data simulasi**, bukan data sensor lapangan. Nilai pembacaan dan ambang di halaman hanya contoh; tidak boleh dipakai untuk menentukan keamanan struktur, kelayakan operasi, atau kondisi banjir nyata. Mode malam merupakan pengolahan visual, bukan foto malam atau CCTV. Eksplorasi menggunakan pergantian gambar, bukan model 3D yang bisa diputar bebas.

Formulir **tidak mengirim pesan** ke email maupun server. Data hanya digunakan di memori halaman untuk membuat berkas laporan saat pengunjung memilih mengunduh. Website tidak menyimpan laporan di database atau localStorage. Tidak ada akun, analitik, cookie pelacakan, atau koneksi API.

Implementasi siap digunakan sebagai profil dan demonstrasi. Untuk monitoring operasional, perlu backend/API sensor, autentikasi yang sesuai, kalibrasi, ambang tervalidasi, penanganan data hilang, dan pengujian lapangan.

## Mengedit konten

- `config.js`: nama, judul tab, interval pembaruan, nilai dasar air, ambang waspada, dan ambang peringatan simulasi.
- `index.html`: judul utama, narasi, profil, label, inovasi, teks galeri, dan formulir.
- `app.js`: deskripsi hotspot, daftar sudut pandang, teks galeri besar, dan interaksi.
- `core.js`: generator data simulasi, klasifikasi ambang, serta isi laporan.
- `styles.css`: warna, tipografi, tata letak, dan animasi.
- `assets/images`: enam gambar Raksawaluya yang telah dioptimalkan ke WebP.
- `assets/fonts`: Geist dan lisensinya.
- `assets/icons`: favicon SVG.

Warna utama berada pada `:root` di awal `styles.css`. Contoh pengaturan:

```js
window.RAKSAWALUYA_CONFIG = {
  name: 'RAKSAWALUYA',
  title: 'Raksawaluya — Sebuah jembatan, banyak kemungkinan.',
  simulation: {
    intervalMs: 3000,
    warningWaterCm: 160,
    alertWaterCm: 200,
    baselineWaterCm: 120
  }
};
```

Gunakan `baselineWaterCm < warningWaterCm < alertWaterCm`. Jarak yang cukup antarnilai membantu skenario tetap mudah dibedakan. Generator menyertakan sedikit variasi gelombang. Mengganti nama pada konfigurasi tidak otomatis mengganti seluruh teks narasi, gambar, deskripsi, atau atribut aksesibilitas; sesuaikan juga berkas kontennya.

## Mengunggah ke hosting

Unggah **isi** folder `raksawaluya-website` ke direktori publik hosting. `index.html` harus berada tepat di direktori yang dilayani, bersama seluruh aset. Struktur minimum:

```text
index.html
styles.css
config.js
core.js
app.js
assets/
```

Bisa digunakan pada hosting statis, cPanel, Nginx, Apache, atau GitHub Pages. Tidak ada routing aplikasi, sehingga tidak membutuhkan rewrite SPA. Bila memakai subfolder, jalur aset relatif sudah mendukungnya.

Untuk Nginx, contoh konfigurasi ada di `deploy/nginx.conf.example`. Ganti domain dan direktori dengan milik sendiri. Konfigurasi contoh melayani HTTP; HTTPS dapat dikonfigurasi sesuai hosting yang digunakan. Jangan menimpa konfigurasi server yang ada tanpa memeriksa domain dan root terlebih dahulu.

## Integrasi sensor nyata di kemudian hari

Generator berada di `core.sample()` dan interval pembaruan di `app.js`. Ganti generator dengan pengambilan data dari API milik pengelola. Tambahkan indikator sumber data, waktu pembacaan terakhir, putus koneksi, status kualitas sensor, dan penanganan galat sebelum menghapus label simulasi. Parameter ambang harus berasal dari spesifikasi operasional yang disahkan, bukan angka contoh paket ini.

## Aset & atribusi

Visual jembatan bersumber dari halaman referensi yang diberikan pengguna (diakses 4 Oktober 2026). Berkas asli dari `framerusercontent.com` dioptimalkan menjadi WebP. Gambar merupakan visualisasi rancangan dan tidak diklaim sebagai foto kondisi lapangan. Hak visual tetap mengikuti pemilik sumber; halaman referensi tidak menyatakan lisensi aset. Atribusi lengkap berada di `CREDITS.md`.

Font Geist berasal dari distribusi Google Fonts dan menggunakan SIL Open Font License; lisensi disertakan dalam folder font. Ikon garis dan favicon SVG ditulis khusus untuk paket ini.

## Pemeriksaan

Pemeriksaan mencakup sintaks JavaScript, kelengkapan tautan lokal/aset/ID, fungsi simulasi dan ambang, serta alur interaksi pada lingkungan DOM. Pengujian DOM tidak membuktikan tampilan piksel atau perilaku perangkat nyata. Tampilan belum diverifikasi melalui browser visual pada lingkungan pembuatan paket; periksa tampilan desktop dan seluler setelah membuka berkas.

Rekomendasi pengecekan akhir: ubah mode siang/malam, pilih keempat sudut gambar, klik tiga hotspot, pilih tiga skenario air, jeda/lanjutkan simulasi, pilih tiga grafik, buka galeri dan gunakan panah/Escape, lalu buat dan unduh laporan.
