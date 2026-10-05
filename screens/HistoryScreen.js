import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { formatRupiah } from '../utils/formatCurrency';

export default function HistoryScreen({ navigation, transactions }) {
  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>NO DATA_</Text>
      </View>
    );
  }

  const sortedTransactions = [...transactions].reverse();

  function renderTransaction({ item }) {
    const totalItem = item.items.reduce((sum, p) => sum + p.quantity, 0);
    return (
      <View style={styles.transactionCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.transactionId}>{item.id}</Text>
          <Text style={styles.transactionTotal}>{formatRupiah(item.total)}</Text>
        </View>
        <Text style={styles.transactionDate}>{item.date} // {totalItem} ITEMS</Text>
        <Text style={styles.itemPreview} numberOfLines={1}>{item.items.map(p => p.name).join(', ')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  listContent: { padding: 16, gap: 16 },
  transactionCard: { backgroundColor: '#0A0A0A', padding: 16, borderWidth: 1, borderLeftWidth: 4, borderColor: '#222', borderLeftColor: '#CCFF00' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  transactionId: { fontSize: 14, fontWeight: '900', color: '#FFF', letterSpacing: 1 },
  transactionTotal: { fontSize: 16, fontWeight: '900', color: '#CCFF00' },
  transactionDate: { fontSize: 12, color: '#888', fontWeight: 'bold', marginBottom: 12, letterSpacing: 1 },
  itemPreview: { fontSize: 12, color: '#555', fontFamily: 'monospace' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#050505' },
  emptyText: { fontSize: 20, fontWeight: '900', color: '#444', letterSpacing: 2 },
});
