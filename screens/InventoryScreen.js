import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatRupiah } from '../utils/formatCurrency';

export default function InventoryScreen({ navigation, products }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.listHeader}>
        <View>
          <Text style={styles.eyebrow}>KATALOG PRODUK</Text>
          <Text style={styles.listTitle}>DAFTAR INVENTORY</Text>
        </View>
        <Text style={styles.itemCount}>{products.length} ITEM</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Tambah Menu')}>
        <Text style={styles.addButtonText}>+ TAMBAH MENU</Text>
      </TouchableOpacity>
      {products.map((product) => (
        <View key={product.id} style={styles.productRow}>
          <View style={styles.productInfo}>
            <Text style={styles.productCategory}>{product.category.toUpperCase()}</Text>
            <Text style={styles.productName}>{product.name}</Text>
          </View>
          <View style={styles.productNumbers}>
            <Text style={styles.productPrice}>{formatRupiah(product.price)}</Text>
            <Text style={styles.productStock}>QTY {product.stock}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  content: { padding: 16, paddingBottom: 32 },
  eyebrow: { color: '#CCFF00', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 7 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 18 },
  listTitle: { color: '#FFF', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  itemCount: { color: '#777', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  addButton: { backgroundColor: '#CCFF00', minHeight: 52, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  addButtonText: { color: '#050505', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#1D1D1D' },
  productInfo: { flex: 1, paddingRight: 12 },
  productCategory: { color: '#CCFF00', fontSize: 9, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 5 },
  productName: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  productNumbers: { alignItems: 'flex-end' },
  productPrice: { color: '#DDD', fontSize: 13, fontWeight: 'bold', marginBottom: 5 },
  productStock: { color: '#777', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
});