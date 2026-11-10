import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
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
import { processPaymentTransaction } from '../services/paymentService';

export default function CartCheckoutScreen() {
  const { cart, updateQuantity, clearCart, completeCheckout } = useCashier();

  const params = useLocalSearchParams<{ method?: PaymentMethod }>();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    params.method || 'TUNAI'
  );
  const [cashInput, setCashInput] = useState<string>('');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const subtotal: number = calculateSubtotal(cart);
  const tax: number = calculateTax(subtotal, 0.11);
  const grandTotal: number = calculateGrandTotal(subtotal, tax);

  const cashPaidAmount: number =
    paymentMethod === 'TUNAI'
      ? parseFloat(cashInput.replace(/[^0-9]/g, '')) || 0
      : grandTotal;

  const changeAmount: number = calculateChange(cashPaidAmount, grandTotal);
  const isPaymentValid: boolean = cart.length > 0;

  useEffect(() => {
    if (paymentMethod !== 'TUNAI') {
      setCashInput(grandTotal > 0 ? grandTotal.toString() : '');
    }
  }, [paymentMethod, grandTotal]);

  function handleGoBack(): void {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  function handleAddMoreItems(): void {
    router.push('/');
  }

  function handleSelectPaymentMethod(method: PaymentMethod): void {
    setPaymentMethod(method);
    router.setParams({ method });
  }

  function handleProcessCheckout(): void {
    if (cart.length === 0) {
      Alert.alert('Keranjang Kosong', 'Silakan pilih menu terlebih dahulu sebelum bayar.');
      return;
    }

    setIsProcessing(true);

    processPaymentTransaction(paymentMethod, cashPaidAmount, grandTotal)
      .then((result) => {
        completeCheckout(paymentMethod, cashPaidAmount);
        Alert.alert('Pembayaran Berhasil', result.message);
        router.replace('/receipt');
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : 'Terjadi kegagalan saat otorisasi pembayaran.';
        Alert.alert('Transaksi Ditolak', message);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }

  function setQuickCash(amount: number): void {
    setCashInput(amount.toString());
  }

  function handleReturnToCatalog(): void {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  }

  function renderCartItem({ item }: { item: CartItem }) {
    const itemSubtotal = item.product.price * item.quantity;

    return (
      <View style={cartStyles.cartItemCard}>
        <View style={cartStyles.itemIconWrapper}>
          {item.product.external ? (
            <Image
              source={{ uri: item.product.external.image }}
              style={{ width: 36, height: 36 }}
              resizeMode="contain"
              accessibilityLabel={item.product.name}
            />
          ) : (
            <Ionicons
              name={item.product.iconName as any}
              size={24}
              color={COLORS.primary}
            />
          )}
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
          onPress={handleGoBack}
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
      <View style={cartStyles.headerSummary}>
        <View>
          <Text style={cartStyles.headerSummaryTitle}>
            Pesanan Pelanggan ({cart.length} Jenis Menu)
          </Text>
          <TouchableOpacity
            onPress={handleAddMoreItems}
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 4 }}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={15} color={COLORS.primary} />
            <Text style={{ fontSize: 12, color: COLORS.primary, fontWeight: '700' }}>
              Tambah Menu (+push)
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={clearCart}>
          <Text style={cartStyles.clearCartText}>Reset Keranjang</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.product.id.toString()}
          renderItem={renderCartItem}
          scrollEnabled={false}
          contentContainerStyle={cartStyles.listContent}
        />

        <View style={cartStyles.checkoutContainer}>
          <Text style={cartStyles.sectionTitle}>Pilih Metode Pembayaran</Text>

          <View style={cartStyles.paymentMethodRow}>
            {(['TUNAI', 'QRIS', 'DEBIT'] as PaymentMethod[]).map((method) => {
              const isSelected = paymentMethod === method;
              return (
                <TouchableOpacity
                  key={method}
                  style={[
                    cartStyles.paymentChip,
                    isSelected && cartStyles.paymentChipActive,
                    { borderColor: isSelected ? COLORS.primary : COLORS.border },
                  ]}
                  onPress={() => handleSelectPaymentMethod(method)}
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

          {paymentMethod === 'TUNAI' && (
            <View>
              <Text style={cartStyles.sectionTitle}>Nominal Diterima</Text>

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

          {/* Tombol Selesaikan Pembayaran dengan Asynchronous Feedback (Modul 3) */}
          <TouchableOpacity
            style={[
              cartStyles.payButton,
              (!isPaymentValid || isProcessing) && cartStyles.payButtonDisabled,
              { opacity: isPaymentValid && !isProcessing ? 1 : 0.6 },
            ]}
            disabled={!isPaymentValid || isProcessing}
            onPress={handleProcessCheckout}
            activeOpacity={0.8}
          >
            {isProcessing ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator size="small" color={COLORS.textLight} />
                <Text style={cartStyles.payButtonText}>
                  Memproses Otorisasi Pembayaran...
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.textLight} />
                <Text style={cartStyles.payButtonText}>
                  Selesaikan Pembayaran ({formatCurrency(grandTotal)})
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
