# KasirKu 🛒

Aplikasi kasir (Point of Sale) sederhana berbasis React Native + Expo.

## Cara Menjalankan

```bash
# Masuk ke folder project
cd KasirKu

# Install dependencies (jika belum)
npm install

# Jalankan aplikasi
npx expo start
```

Setelah Expo berjalan, scan QR code menggunakan aplikasi **Expo Go** di HP.

---

## Struktur Folder

```
KasirKu/
├── App.js                    # Entry point + navigasi + state global
├── app.json                  # Konfigurasi Expo
├── package.json              # Daftar dependensi
│
├── data/
│   └── products.js           # Data produk dummy
│
├── screens/
│   ├── DashboardScreen.js    # Halaman utama / beranda
│   ├── ProductScreen.js      # Daftar produk + pencarian
│   ├── CartScreen.js         # Keranjang belanja
│   ├── CheckoutScreen.js     # Input pembayaran + kembalian
│   ├── ReceiptScreen.js      # Struk transaksi
│   └── HistoryScreen.js      # Riwayat transaksi
│
└── utils/
    └── formatCurrency.js     # Helper format Rupiah
```

---

## Pembagian Tugas Kelompok

### Anggota 1 — Dashboard & Produk
- `screens/DashboardScreen.js`
- `screens/ProductScreen.js`
- `data/products.js`

### Anggota 2 — Keranjang & Checkout
- `screens/CartScreen.js`
- `screens/CheckoutScreen.js`

### Anggota 3 — Struk, Riwayat & Styling
- `screens/ReceiptScreen.js`
- `screens/HistoryScreen.js`
- `utils/formatCurrency.js`
- Penyempurnaan UI/styling

---

## Contoh Commit Message

```
feat: create dashboard screen
feat: add product list with search
feat: create shopping cart
feat: add checkout calculation
feat: create transaction receipt
feat: add transaction history
style: improve card layout
fix: fix cart quantity calculation
```

---

## Cara Kerja Aplikasi

1. **Dashboard** → tampilkan statistik + tombol navigasi
2. **Produk** → pilih produk, tekan `+` untuk tambah ke keranjang
3. **Keranjang** → atur jumlah, lihat total, tekan Checkout
4. **Checkout** → masukkan uang bayar, lihat kembalian, tekan Bayar
5. **Struk** → lihat ringkasan transaksi, tekan Selesai
6. **Riwayat** → lihat semua transaksi yang sudah dilakukan

---

## Dependensi

- `expo` ~57.0.26
- `react-native` 0.86.3
- `@react-navigation/native` — navigasi antar halaman
- `@react-navigation/stack` — Stack Navigator
- `react-native-screens` — optimasi navigasi
- `react-native-safe-area-context` — safe area (notch, dll)
