import { PaymentMethod } from '../types/cashier';

export interface PaymentResult {
  success: boolean;
  transactionCode: string;
  timestamp: string;
  message: string;
}

/**
 * ============================================================================
 * IMPLEMENTASI MODUL 3 (KRITERIA 2): CUSTOM ASYNC / PROMISE FUNCTION
 * (MENGGUNAKAN resolve() DAN reject())
 * ============================================================================
 * Definisi:
 * Custom Promise Function adalah fungsi asynchronous yang didefinisikan sendiri 
 * oleh developer yang mengembalikan objek `Promise<PaymentResult>` serta 
 * mengelola penyelesaian proses menggunakan `resolve()` (ketika berhasil) 
 * dan `reject()` (ketika gagal/ditolak).
 *
 * Kegunaan Nyata pada Aplikasi KasirKu:
 * Mensimulasikan pemrosesan otorisasi transaksi pada payment gateway / core banking
 * (validasi nominal bayar tunai, otorisasi QRIS, atau kliring kartu Debit) 
 * dengan penundaan waktu (simulated network latency) sebesar 1.2 detik sebelum 
 * menyelesaikan (`resolve`) atau menolak (`reject`) transaksi.
 * ============================================================================
 */
export function processPaymentTransaction(
  paymentMethod: PaymentMethod,
  cashPaid: number,
  grandTotal: number
): Promise<PaymentResult> {
  // Custom Promise buatan sendiri dengan callback resolve() dan reject()
  return new Promise<PaymentResult>((resolve, reject) => {
    // Simulasi delay pemrosesan transaksi selama 1200 ms (1.2 detik)
    setTimeout(() => {
      // 1. Validasi tagihan tidak valid -> panggil reject()
      if (grandTotal <= 0) {
        reject(
          new Error('Total tagihan tidak valid (Rp 0). Silakan pilih menu terlebih dahulu.')
        );
        return;
      }

      // 2. Validasi logika bisnis kasir: uang tunai kurang -> panggil reject()
      if (paymentMethod === 'TUNAI' && cashPaid < grandTotal) {
        reject(
          new Error(
            `Uang pembayaran kurang! Total tagihan adalah Rp ${grandTotal.toLocaleString(
              'id-ID'
            )}, tetapi uang yang diterima baru Rp ${cashPaid.toLocaleString('id-ID')}.`
          )
        );
        return;
      }

      // 3. Generate kode otorisasi unik untuk transaksi yang valid
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const transactionCode = `AUTH-${paymentMethod.slice(0, 3)}-${randomSuffix}`;

      // 4. Operasi berhasil -> panggil resolve() dan kirim data PaymentResult ke .then()
      resolve({
        success: true,
        transactionCode,
        timestamp: new Date().toISOString(),
        message: `Pembayaran kasir sebesar Rp ${grandTotal.toLocaleString(
          'id-ID'
        )} via ${paymentMethod} (${transactionCode}) berhasil diproses.`,
      });
    }, 1200);
  });
}

