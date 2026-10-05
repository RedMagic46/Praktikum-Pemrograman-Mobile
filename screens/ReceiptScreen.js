import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { formatRupiah } from '../utils/formatCurrency';

export default function ReceiptScreen({ navigation, route }) {
  const { transaction } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.receiptContainer}>
        <Text style={styles.storeName}>K A S I R K U .</Text>
        <Text style={styles.transactionId}>{transaction.id}</Text>
        <Text style={styles.date}>{transaction.date}</Text>
        
        <Text style={styles.separator}>================================</Text>

        {transaction.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQtyPrice}>{item.quantity} x {formatRupiah(item.price)}</Text>
            </View>
            <Text style={styles.itemSubtotal}>{formatRupiah(item.price * item.quantity)}</Text>
          </View>
        ))}

        <Text style={styles.separator}>--------------------------------</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>TOTAL</Text>
          <Text style={styles.summaryValue}>{formatRupiah(transaction.total)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>CASH</Text>
          <Text style={styles.summaryValue}>{formatRupiah(transaction.payment)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>CHANGE</Text>
          <Text style={styles.summaryHighlight}>{formatRupiah(transaction.change)}</Text>
        </View>

        <Text style={styles.separator}>================================</Text>
        <Text style={styles.thankYou}>TX_COMPLETE</Text>
      </View>

      <TouchableOpacity style={styles.finishButton} onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.finishButtonText}>CLOSE TERMINAL</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', padding: 16 },
  receiptContainer: { backgroundColor: '#000', padding: 24, borderWidth: 1, borderColor: '#333', marginBottom: 24 },
  storeName: { fontSize: 24, fontWeight: '900', color: '#CCFF00', textAlign: 'center', marginBottom: 8, letterSpacing: 2 },
  transactionId: { fontSize: 12, color: '#888', textAlign: 'center', fontFamily: 'monospace', marginBottom: 4 },
  date: { fontSize: 12, color: '#888', textAlign: 'center', fontFamily: 'monospace' },
  separator: { color: '#333', textAlign: 'center', marginVertical: 16, fontFamily: 'monospace', fontSize: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  itemLeft: { flex: 1 },
  itemName: { fontSize: 14, color: '#FFF', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: 4 },
  itemQtyPrice: { fontSize: 12, color: '#888', fontFamily: 'monospace' },
  itemSubtotal: { fontSize: 14, color: '#FFF', fontFamily: 'monospace', fontWeight: 'bold' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#888', fontFamily: 'monospace' },
  summaryValue: { fontSize: 14, color: '#FFF', fontFamily: 'monospace', fontWeight: 'bold' },
  summaryHighlight: { fontSize: 14, color: '#CCFF00', fontFamily: 'monospace', fontWeight: 'bold' },
  thankYou: { fontSize: 14, color: '#CCFF00', textAlign: 'center', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 2 },
  finishButton: { backgroundColor: '#111', padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  finishButtonText: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
});
