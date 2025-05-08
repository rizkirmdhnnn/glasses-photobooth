# Glasses Overlay Application

Aplikasi ini memungkinkan pengguna untuk mencoba berbagai model kacamata secara virtual menggunakan webcam. Aplikasi ini memanfaatkan teknologi deteksi wajah untuk menempatkan kacamata dengan tepat pada wajah pengguna dalam waktu nyata (real-time).

## Fitur Utama

- **Deteksi Wajah Real-time**: Menggunakan TinyFaceDetector dari face-api.js untuk deteksi wajah yang cepat dan akurat
- **Penempatan Kacamata Otomatis**: Menggunakan faceLandmark68Net untuk mendeteksi posisi mata dan menempatkan kacamata dengan tepat
- **9 Pilihan Model Kacamata**: Pengguna dapat berganti antar berbagai model kacamata dengan tombol "CHANGE GLASSES"
- **Fitur Capture**: Pengguna dapat mengambil gambar dengan kacamata yang terpasang
- **Galeri Gambar**: Semua gambar yang di-capture tersimpan dalam galeri dan dapat dihapus kapan saja
- **Tampilan Neobrutalism**: Interface dengan desain neobrutalism yang menarik dan modern

## Teknologi yang Digunakan

- **face-api.js**: Pustaka JavaScript untuk deteksi wajah dan landmark
- **HTML Canvas**: Untuk menggambar overlay kacamata pada video
- **TailwindCSS**: Framework CSS untuk styling
- **JavaScript**: Untuk logika aplikasi dan interaksi pengguna

## Cara Kerja

### Alur Proses Aplikasi

1. **Initialization**: 
   - Memuat library face-api.js
   - Memulai stream video dari webcam
   - Mengatur canvas overlay
   - Memuat gambar kacamata awal

2. **Detection Loop**:
   - Mendeteksi wajah pada setiap frame video
   - Mendapatkan landmark wajah jika wajah terdeteksi
   - Menghitung posisi mata dan sudut orientasi wajah
   - Menggambar kacamata pada posisi yang sesuai
   - Memproses frame berikutnya

3. **User Interactions**:
   - Pengguna dapat mengganti model kacamata
   - Pengguna dapat mengambil gambar dengan tombol "CAPTURE"
   - Pengguna dapat menghapus gambar dari galeri

### Perhitungan Posisi Kacamata

- **Rotasi**: Dihitung dari posisi kedua mata menggunakan `Math.atan2(dy, dx)`
- **Ukuran**: Lebar kacamata dihitung dari jarak antar mata dikalikan faktor 2.5
- **Penempatan**: Kacamata ditempatkan pada titik tengah antara kedua mata

## Cara Menggunakan

1. Buka `index.html` di browser (pastikan browser memiliki akses ke webcam)
2. Izinkan akses webcam ketika diminta
3. Posisikan wajah Anda agar terlihat di layar
4. Gunakan tombol "CHANGE GLASSES" untuk mencoba berbagai model kacamata
5. Klik tombol "CAPTURE" untuk mengambil gambar
6. Lihat dan kelola gambar yang diambil di galeri di bawah video

## Flowchart

Aplikasi ini memiliki flowchart visual yang dapat diakses melalui `flowchart.html`. Flowchart ini menunjukkan alur kerja aplikasi secara keseluruhan dan dapat diunduh sebagai file PNG.

## Struktur Folder

- `index.html` - File utama aplikasi
- `app.js` - Kode JavaScript untuk logika aplikasi
- `flowchart.html` - Visualisasi alur kerja aplikasi
- `models/` - Berisi model deteksi wajah dan landmark
- `glasses/` - Berisi gambar kacamata yang digunakan dalam aplikasi

## Pengembangan Lebih Lanjut

Beberapa ide untuk pengembangan lebih lanjut:
- Menambahkan lebih banyak pilihan kacamata
- Implementasi fitur penyesuaian ukuran dan posisi kacamata secara manual
- Menambahkan filter warna pada kacamata
- Integrasi dengan sosial media untuk berbagi gambar
- Penyimpanan gambar secara lokal menggunakan localStorage
