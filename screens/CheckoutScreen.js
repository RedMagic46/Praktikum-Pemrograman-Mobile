import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { formatRupiah } from '../utils/formatCurrency';

export default function CheckoutScreen({ navigation, cart, setCart, addTransaction }) {
  const [paymentText, setPaymentText] = useState('');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const payment = parseInt(paymentText.replace(/\D/g, ''), 10) || 0;
  const change = payment - total;

  function handlePayment() {
    if (payment < total) {
      Alert.alert('ERR_FUNDS', 'Uang pembayaran tidak mencukupi.');
      return;
    }
    const newTransaction = {
      id: 'TX-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase(),
      items: [...cart],
      total: total,
      payment: payment,
      change: change,
    };
    addTransaction(newTransaction);
    setCart([]);
    navigation.navigate('Struk', { transaction: newTransaction });
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>TOTAL DUE</Text>
          <Text style={styles.totalAmount}>{formatRupiah(total)}</Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>CASH TENDERED</Text>
          <TextInput
            style={styles.paymentInput}
            placeholder="0"
            placeholderTextColor="#444"
            keyboardType="numeric"
            value={paymentText}
            onChangeText={setPaymentText}
          />
          <View style={styles.quickPayRow}>
            {[20000, 50000, 100000].map((nominal) => (
              <TouchableOpacity key={nominal} style={styles.quickPayButton} onPress={() => setPaymentText(nominal.toString())}>
                <Text style={styles.quickPayText}>{nominal / 1000}K</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.changeBox}>
          <Text style={styles.changeLabel}>CHANGE</Text>
          <Text style={[styles.changeAmount, change < 0 && payment > 0 ? styles.changeError : null]}>
            {payment === 0 ? '---' : change < 0 ? 'INSUFFICIENT' : formatRupiah(change)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.payButton, payment < total ? styles.payButtonDisabled : null]} onPress={handlePayment}>
          <Text style={[styles.payButtonText, payment < total ? styles.payButtonTextDisabled : null]}>CONFIRM PAYMENT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  content: { flex: 1, padding: 24, gap: 32 },
  totalBox: { alignItems: 'center', paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: '#222' },
  totalLabel: { fontSize: 12, color: '#CCFF00', fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  totalAmount: { fontSize: 40, fontWeight: '900', color: '#FFF' },
  inputSection: { gap: 12 },
  inputLabel: { fontSize: 12, color: '#888', fontWeight: 'bold', letterSpacing: 1 },
  paymentInput: { backgroundColor: '#0A0A0A', color: '#CCFF00', fontSize: 32, fontWeight: '900', padding: 20, borderWidth: 1, borderColor: '#333', textAlign: 'center' },
  quickPayRow: { flexDirection: 'row', gap: 12 },
  quickPayButton: { flex: 1, backgroundColor: '#111', padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  quickPayText: { color: '#FFF', fontSize: 14, fontWeight: '900' },
  changeBox: { backgroundColor: '#0A0A0A', padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  changeLabel: { fontSize: 12, color: '#888', fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 },
  changeAmount: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  changeError: { color: '#FF0055' },
  footer: { padding: 24, backgroundColor: '#050505' },
  payButton: { backgroundColor: '#CCFF00', padding: 20, alignItems: 'center' },
  payButtonDisabled: { backgroundColor: '#111', borderWidth: 1, borderColor: '#333' },
  payButtonText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  payButtonTextDisabled: { color: '#444' },
});
