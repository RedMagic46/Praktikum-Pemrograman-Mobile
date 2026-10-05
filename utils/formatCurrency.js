// Helper untuk format angka menjadi format mata uang Rupiah
// Contoh: 15000 => "Rp15.000"
function formatRupiah(amount) {
  return 'Rp' + amount.toLocaleString('id-ID');
}

export { formatRupiah };
