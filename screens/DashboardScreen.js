import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { formatRupiah } from '../utils/formatCurrency';

export default function DashboardScreen({ navigation, transactions }) {
  const totalTransaksi = transactions.length;
  const totalPendapatan = transactions.reduce((sum, trx) => sum + trx.total, 0);

  return (
    <ScrollView style={styles.container}>
      {/* Header anti-mainstream */}
      <View style={styles.header}>
        <Text style={styles.date}>TODAY'S SHIFT</Text>
        <Text style={styles.greeting}>SYSTEM ONLINE_</Text>
      </View>

      {/* Kartu Statistik */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statCardDark]}>
          <Text style={styles.statLabel}>TX_COUNT</Text>
          <Text style={styles.statValue}>{totalTransaksi}</Text>
        </View>
        <View style={[styles.statCard, styles.statCardHighlight]}>
          <Text style={[styles.statLabel, styles.textDark]}>REVENUE</Text>
          <Text style={[styles.statValue, styles.textDark]}>{formatRupiah(totalPendapatan)}</Text>
        </View>
      </View>

      {/* Tombol Utama */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate('Produk')}>
          <Text style={styles.buttonPrimaryText}>+ NEW TRANSACTION</Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Inventory')}>
            <Text style={styles.buttonSecondaryText}>INVENTORY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Riwayat')}>
            <Text style={styles.buttonSecondaryText}>HISTORY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  header: { padding: 24, paddingTop: 40, paddingBottom: 20 },
  date: { fontSize: 12, color: '#CCFF00', fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  greeting: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', letterSpacing: -1 },
  statsRow: { flexDirection: 'row', padding: 16, gap: 16 },
  statCard: { flex: 1, borderRadius: 0, padding: 20, borderWidth: 1, borderColor: '#333' },
  statCardDark: { backgroundColor: '#0A0A0A' },
  statCardHighlight: { backgroundColor: '#CCFF00', borderColor: '#CCFF00' },
  statLabel: { fontSize: 11, fontWeight: 'bold', color: '#666', letterSpacing: 2, marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  textDark: { color: '#000' },
  buttonContainer: { padding: 16, gap: 16 },
  buttonPrimary: { backgroundColor: '#CCFF00', borderRadius: 0, padding: 20, alignItems: 'center' },
  buttonPrimaryText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  buttonRow: { flexDirection: 'row', gap: 16 },
  buttonSecondary: { flex: 1, backgroundColor: '#0A0A0A', padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  buttonSecondaryText: { color: '#FFF', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
});
