import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCashier } from '../context/CashierContext';
import { formatCurrency } from '../utils/cashierUtils';
import { receiptStyles } from '../styles/receiptStyles';
import { COLORS } from '../styles/posStyles';

export default function ReceiptScreen() {
  const { lastTransaction, resetTransaction } = useCashier();

  // Jika tidak ada transaksi terakhir, arahkan kembali ke katalog
  if (!lastTransaction) {
    return (
      <SafeAreaView
        style={[
          receiptStyles.container,
          { justifyContent: 'center', alignItems: 'center', padding: 24 },
        ]}
      >
        <Ionicons name="receipt-outline" size={64} color={COLORS.textMuted} />
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: COLORS.textPrimary,
            marginTop: 16,
          }}
        >
          Belum Ada Data Struk
        </Text>
        <TouchableOpacity
          style={[
            receiptStyles.newTransactionBtn,
            { paddingHorizontal: 24, marginTop: 16 },
          ]}
          onPress={() => router.replace('/')}
        >
          <Text style={receiptStyles.newTransactionBtnText}>
            Kembali ke Katalog Kasir
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  function handleNewTransaction(): void {
    resetTransaction();
    router.replace('/');
  }

  function handlePrintReceipt(): void {
    Alert.alert(
      'Cetak Struk',
      'Struk transaksi berhasil dikirim ke antrean printer thermal Bluetooth / disimpan!'
    );
  }

  return (
    <SafeAreaView style={receiptStyles.container}>
      <ScrollView
        contentContainerStyle={receiptStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Sukses Transaksi */}
        <View style={receiptStyles.successBanner}>
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={COLORS.primaryDark}
          />
          <Text style={receiptStyles.successBannerText}>
            Transaksi Berhasil & Lunas
          </Text>
        </View>

        {/* Kertas Struk Thermal KasirKu */}
        <View style={receiptStyles.receiptPaper}>
          {/* Header Toko */}
          <View style={receiptStyles.storeHeader}>
            <View style={receiptStyles.storeLogoBox}>
              <Ionicons name="storefront" size={24} color={COLORS.primary} />
            </View>
            <Text style={receiptStyles.storeTitle}>KASIRKU STORE</Text>
            <Text style={receiptStyles.storeAddress}>
              Jl. Raya Tlogomas No. 246, Kota Malang
            </Text>
            <Text style={receiptStyles.storeContact}>
              Telp: (0341) 464318 | KasirKu POS
            </Text>
          </View>

          {/* Garis Putus-putus */}
          <View style={receiptStyles.dashedLine} />

          {/* Info Transaksi */}
          <View style={receiptStyles.metaRow}>
            <Text style={receiptStyles.metaLabel}>No. Faktur</Text>
            <Text style={receiptStyles.metaValue}>
              {lastTransaction.invoiceNumber}
            </Text>
          </View>
          <View style={receiptStyles.metaRow}>
            <Text style={receiptStyles.metaLabel}>Waktu</Text>
            <Text style={receiptStyles.metaValue}>{lastTransaction.date}</Text>
          </View>
          <View style={receiptStyles.metaRow}>
            <Text style={receiptStyles.metaLabel}>Kasir</Text>
            <Text style={receiptStyles.metaValue}>
              {lastTransaction.cashierName}
            </Text>
          </View>
          <View style={receiptStyles.metaRow}>
            <Text style={receiptStyles.metaLabel}>Pembayaran</Text>
            <Text style={receiptStyles.metaValue}>
              {lastTransaction.paymentMethod}
            </Text>
          </View>

          {/* Garis Putus-putus */}
          <View style={receiptStyles.dashedLine} />

          {/* Daftar Item Belanja Menggunakan .map() Loop */}
          {lastTransaction.items.map((item, index) => (
            <View key={item.id.toString() + '-' + index} style={receiptStyles.itemRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={receiptStyles.itemName}>{item.name}</Text>
                <Text style={receiptStyles.itemCalc}>
                  {formatCurrency(item.price)} x {item.quantity}
                </Text>
              </View>
              <Text style={receiptStyles.itemPriceTotal}>
                {formatCurrency(item.subtotal)}
              </Text>
            </View>
          ))}

          {/* Garis Putus-putus */}
          <View style={receiptStyles.dashedLine} />

          {/* Rincian Total */}
          <View style={receiptStyles.summaryRow}>
            <Text style={receiptStyles.summaryLabel}>Subtotal</Text>
            <Text style={receiptStyles.summaryValue}>
              {formatCurrency(lastTransaction.subtotal)}
            </Text>
          </View>

          <View style={receiptStyles.summaryRow}>
            <Text style={receiptStyles.summaryLabel}>PPN (11%)</Text>
            <Text style={receiptStyles.summaryValue}>
              {formatCurrency(lastTransaction.tax)}
            </Text>
          </View>

          <View style={receiptStyles.grandTotalRow}>
            <Text style={receiptStyles.grandTotalLabel}>TOTAL AKHIR</Text>
            <Text style={receiptStyles.grandTotalValue}>
              {formatCurrency(lastTransaction.total)}
            </Text>
          </View>

          {lastTransaction.paymentMethod === 'TUNAI' && (
            <>
              <View style={receiptStyles.summaryRow}>
                <Text style={receiptStyles.summaryLabel}>Tunai Diterima</Text>
                <Text style={receiptStyles.summaryValue}>
                  {formatCurrency(lastTransaction.cashPaid)}
                </Text>
              </View>
              <View style={receiptStyles.summaryRow}>
                <Text style={receiptStyles.summaryLabel}>Kembalian</Text>
                <Text
                  style={[
                    receiptStyles.summaryValue,
                    { color: COLORS.secondary, fontWeight: '800' },
                  ]}
                >
                  {formatCurrency(lastTransaction.change)}
                </Text>
              </View>
            </>
          )}

          {/* Footer Struk */}
          <View style={receiptStyles.dashedLine} />

          <View style={receiptStyles.footerSection}>
            <View style={receiptStyles.barcodeBox}>
              <Text style={receiptStyles.barcodeText}>
                ||| ||| || |||| ||| | |||
              </Text>
            </View>
            <Text style={receiptStyles.thankYouText}>
              Terima Kasih Atas Kunjungan Anda!
            </Text>
            <Text style={receiptStyles.noticeText}>
              Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan.
            </Text>
          </View>
        </View>

        {/* Tombol Aksi Kasir */}
        <View style={receiptStyles.actionGroup}>
          <TouchableOpacity
            style={receiptStyles.newTransactionBtn}
            onPress={handleNewTransaction}
            activeOpacity={0.8}
          >
            <Ionicons name="cart" size={18} color={COLORS.textLight} />
            <Text style={receiptStyles.newTransactionBtnText}>
              Mulai Transaksi Baru
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={receiptStyles.secondaryBtn}
            onPress={handlePrintReceipt}
            activeOpacity={0.8}
          >
            <Ionicons name="print-outline" size={18} color={COLORS.textSecondary} />
            <Text style={receiptStyles.secondaryBtnText}>
              Cetak Ulang Struk
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
