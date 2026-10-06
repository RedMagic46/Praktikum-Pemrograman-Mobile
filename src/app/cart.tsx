import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCashier } from '../context/CashierContext';
import { CartItem, PaymentMethod } from '../types/cashier';
import {
  formatCurrency,
  calculateSubtotal,
  calculateTax,
  calculateGrandTotal,
  calculateChange,
} from '../utils/cashierUtils';
import { cartStyles } from '../styles/cartStyles';
import { COLORS } from '../styles/posStyles';

export default function CartCheckoutScreen() {
  const { cart, updateQuantity, clearCart, completeCheckout } = useCashier();

  // State metode pembayaran & input nominal tunai
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TUNAI');
  const [cashInput, setCashInput] = useState<string>('');

  // Perhitungan rincian pembayaran
  const subtotal: number = calculateSubtotal(cart);
  const tax: number = calculateTax(subtotal, 0.11); // PPN 11%
  const grandTotal: number = calculateGrandTotal(subtotal, tax);

  const cashPaidAmount: number =
    paymentMethod === 'TUNAI'
      ? parseFloat(cashInput.replace(/[^0-9]/g, '')) || 0
      : grandTotal;

  const changeAmount: number = calculateChange(cashPaidAmount, grandTotal);
  const isPaymentValid: boolean =
    cart.length > 0 &&
    (paymentMethod !== 'TUNAI' || cashPaidAmount >= grandTotal);

  /**
   * Menangani tombol proses checkout & transaksi kasir
   */
  function handleProcessCheckout(): void {
    if (cart.length === 0) {
      Alert.alert('Keranjang Kosong', 'Silakan pilih menu terlebih dahulu sebelum bayar.');
      return;
    }

    if (paymentMethod === 'TUNAI' && cashPaidAmount < grandTotal) {
      Alert.alert(
        'Uang Tidak Cukup',
        `Uang yang dibayarkan kurang dari total belanja (${formatCurrency(grandTotal)}).`
      );
      return;
    }

    // Selesaikan transaksi dan navigasi ke halaman Struk
    completeCheckout(paymentMethod, cashPaidAmount);
    router.replace('/receipt');
  }

  /**
   * Mengatur uang cepat dengan nominal preset
   */
  function setQuickCash(amount: number): void {
    setCashInput(amount.toString());
  }

  /**
   * Custom function me-render item keranjang pada FlatList
   */
  function renderCartItem({ item }: { item: CartItem }) {
    const itemSubtotal = item.product.price * item.quantity;

    return (
      <View style={cartStyles.cartItemCard}>
        <View style={cartStyles.itemIconWrapper}>
          <Ionicons
            name={item.product.iconName as any}
            size={24}
            color={COLORS.primary}
          />
        </View>

        <View style={cartStyles.itemInfo}>
          <Text style={cartStyles.itemName}>{item.product.name}</Text>
          <Text style={cartStyles.itemPrice}>
            {formatCurrency(item.product.price)} x {item.quantity}
          </Text>
          <Text style={cartStyles.itemSubtotal}>
            {formatCurrency(itemSubtotal)}
          </Text>
        </View>

        {/* Kontrol Kuantitas (+ dan -) */}
        <View style={cartStyles.qtyControlRow}>
          <TouchableOpacity
            style={cartStyles.qtyButton}
            onPress={() => updateQuantity(item.product.id, -1)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.quantity === 1 ? 'trash-outline' : 'remove'}
              size={16}
              color={item.quantity === 1 ? COLORS.danger : COLORS.textPrimary}
            />
          </TouchableOpacity>

          <Text style={cartStyles.qtyText}>{item.quantity}</Text>

          <TouchableOpacity
            style={cartStyles.qtyButton}
            onPress={() => updateQuantity(item.product.id, 1)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (cart.length === 0) {
    return (
      <View
        style={[
          cartStyles.container,
          { justifyContent: 'center', alignItems: 'center', padding: 24 },
        ]}
      >
        <Ionicons name="cart-outline" size={72} color={COLORS.textMuted} />
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: COLORS.textPrimary,
            marginTop: 16,
          }}
        >
          Keranjang Masih Kosong
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: COLORS.textMuted,
            textAlign: 'center',
            marginTop: 6,
            marginBottom: 24,
          }}
        >
          Belum ada item pesanan yang dipilih. Kembali ke katalog untuk menambahkan menu.
        </Text>
        <TouchableOpacity
          style={[
            cartStyles.payButton,
            { paddingHorizontal: 28, width: 'auto' },
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={18} color={COLORS.textLight} />
          <Text style={cartStyles.payButtonText}>Kembali ke Katalog</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={cartStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header Info Keranjang */}
      <View style={cartStyles.headerSummary}>
        <Text style={cartStyles.headerSummaryTitle}>
          Pesanan Pelanggan ({cart.length} Jenis Menu)
        </Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={cartStyles.clearCartText}>Reset Keranjang</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* FlatList Item Belanja Kasir */}
        <FlatList
          data={cart}
          keyExtractor={(item) => item.product.id.toString()}
          renderItem={renderCartItem}
          scrollEnabled={false}
          contentContainerStyle={cartStyles.listContent}
        />

        {/* Panel Form Pembayaran Kasir */}
        <View style={cartStyles.checkoutContainer}>
          <Text style={cartStyles.sectionTitle}>Pilih Metode Pembayaran</Text>

          {/* Tombol Opsi Metode Bayar */}
          <View style={cartStyles.paymentMethodRow}>
            {(['TUNAI', 'QRIS', 'DEBIT'] as PaymentMethod[]).map((method) => {
              const isSelected = paymentMethod === method;
              return (
                <TouchableOpacity
                  key={method}
                  style={[
                    cartStyles.paymentChip,
                    isSelected && cartStyles.paymentChipActive,
                    // Inline Style dynamic border
                    { borderColor: isSelected ? COLORS.primary : COLORS.border },
                  ]}
                  onPress={() => setPaymentMethod(method)}
                >
                  <Ionicons
                    name={
                      method === 'TUNAI'
                        ? 'cash-outline'
                        : method === 'QRIS'
                        ? 'qr-code-outline'
                        : 'card-outline'
                    }
                    size={16}
                    color={isSelected ? COLORS.primaryDark : COLORS.textSecondary}
                  />
                  <Text
                    style={[
                      cartStyles.paymentChipText,
                      isSelected && cartStyles.paymentChipTextActive,
                    ]}
                  >
                    {method}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Opsi Tunai (Input Cash & Shortcut Cepat) */}
          {paymentMethod === 'TUNAI' && (
            <View>
              <Text style={cartStyles.sectionTitle}>Nominal Diterima</Text>

              {/* Shortcut Uang Cepat */}
              <View style={cartStyles.quickCashRow}>
                <TouchableOpacity
                  style={cartStyles.quickCashChip}
                  onPress={() => setQuickCash(grandTotal)}
                >
                  <Text style={cartStyles.quickCashText}>Uang Pas</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={cartStyles.quickCashChip}
                  onPress={() => setQuickCash(50000)}
                >
                  <Text style={cartStyles.quickCashText}>50.000</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={cartStyles.quickCashChip}
                  onPress={() => setQuickCash(100000)}
                >
                  <Text style={cartStyles.quickCashText}>100.000</Text>
                </TouchableOpacity>
              </View>

              <View style={cartStyles.cashInputWrapper}>
                <Text style={cartStyles.currencyPrefix}>Rp</Text>
                <TextInput
                  style={cartStyles.cashInput}
                  placeholder="0"
                  keyboardType="numeric"
                  value={cashInput}
                  onChangeText={setCashInput}
                />
              </View>
            </View>
          )}

          {/* Ringkasan Biaya Belanja */}
          <View style={cartStyles.billRow}>
            <Text style={cartStyles.billLabel}>Subtotal</Text>
            <Text style={cartStyles.billValue}>{formatCurrency(subtotal)}</Text>
          </View>

          <View style={cartStyles.billRow}>
            <Text style={cartStyles.billLabel}>PPN (11%)</Text>
            <Text style={cartStyles.billValue}>{formatCurrency(tax)}</Text>
          </View>

          <View style={cartStyles.divider} />

          <View style={cartStyles.totalRow}>
            <Text style={cartStyles.totalLabel}>Total Tagihan</Text>
            <Text style={cartStyles.totalValue}>
              {formatCurrency(grandTotal)}
            </Text>
          </View>

          {paymentMethod === 'TUNAI' && (
            <View style={cartStyles.changeRow}>
              <Text style={cartStyles.changeLabel}>Kembalian</Text>
              <Text
                style={[
                  cartStyles.changeValue,
                  {
                    color:
                      cashPaidAmount < grandTotal
                        ? COLORS.danger
                        : COLORS.secondary,
                  },
                ]}
              >
                {cashPaidAmount < grandTotal
                  ? `Kurang ${formatCurrency(grandTotal - cashPaidAmount)}`
                  : formatCurrency(changeAmount)}
              </Text>
            </View>
          )}

          {/* Tombol Selesaikan Pembayaran */}
          <TouchableOpacity
            style={[
              cartStyles.payButton,
              !isPaymentValid && cartStyles.payButtonDisabled,
              { opacity: isPaymentValid ? 1 : 0.6 },
            ]}
            disabled={!isPaymentValid}
            onPress={handleProcessCheckout}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={20} color={COLORS.textLight} />
            <Text style={cartStyles.payButtonText}>
              Selesaikan Pembayaran ({formatCurrency(grandTotal)})
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
