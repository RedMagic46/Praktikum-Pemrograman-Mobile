import { PaymentMethod } from '../types/cashier';

export interface PaymentResult {
  success: boolean;
  transactionCode: string;
  timestamp: string;
  message: string;
}

export function processPaymentTransaction(
  paymentMethod: PaymentMethod,
  cashPaid: number,
  grandTotal: number
): Promise<PaymentResult> {
  return new Promise<PaymentResult>((resolve, reject) => {
    setTimeout(() => {
      if (grandTotal <= 0) {
        reject(
          new Error('Total tagihan tidak valid (Rp 0). Silakan pilih menu terlebih dahulu.')
        );
        return;
      }

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

