import { PaymentMethod } from '../types/cashier';

export interface PaymentResult {
  success: boolean;
  transactionCode: string;
  timestamp: string;
  message: string;
}

/**
 * ============================================================================
 * IMPLEMENTASI MODUL 3 (KRITERIA 2): CUSTOM ASYNC FUNCTION
 * ============================================================================
 * Definisi:
 * Custom Async Function adalah fungsi asynchronous yang didefinisikan sendiri 
 * oleh developer menggunakan kata kunci `async`, memanfaatkan `await` untuk 
 * menunggu proses non-blocking, serta mengembalikan/mengelola objek `Promise`.
 *
 * Kegunaan Nyata pada Aplikasi KasirKu:
 * Mensimulasikan pemrosesan otorisasi transaksi pada payment gateway / core banking
 * (validasi nominal bayar tunai, otorisasi QRIS, atau kliring kartu Debit) 
 * dengan penundaan waktu (simulated network latency) sebesar 1.2 detik sebelum 
 * menyelesaikan transaksi.
 * ============================================================================
 */
export async function processPaymentTransaction(
  paymentMethod: PaymentMethod,
  cashPaid: number,
  grandTotal: number
): Promise<PaymentResult> {
  // 1. Validasi logika bisnis kasir
  if (paymentMethod === 'TUNAI' && cashPaid < grandTotal) {
    throw new Error(
      `Uang pembayaran kurang! Total tagihan adalah Rp ${grandTotal.toLocaleString(
        'id-ID'
      )}, tetapi uang yang diterima baru Rp ${cashPaid.toLocaleString('id-ID')}.`
    );
  }

  // 2. Custom Promise buatan sendiri untuk simulasi latency pemrosesan kasir
  const result = await new Promise<PaymentResult>((resolve, reject) => {
    // Simulasi delay pemrosesan transaksi selama 1200 ms (1.2 detik)
    setTimeout(() => {
      // Generate kode otorisasi unik untuk transaksi
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const transactionCode = `AUTH-${paymentMethod.slice(0, 3)}-${randomSuffix}`;

      // Operasi berhasil -> panggil resolve()
      resolve({
        success: true,
        transactionCode,
        timestamp: new Date().toISOString(),
        message: `Pembayaran kasir sebesar Rp ${grandTotal.toLocaleString(
          'id-ID'
        )} via ${paymentMethod} berhasil diproses.`,
      });
    }, 1200);
  });

  return result;
}

