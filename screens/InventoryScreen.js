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
      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>BELUM ADA PRODUK_</Text>
        </View>
      ) : (
        products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Edit Menu', { product })}
          >
            <View style={styles.productInfo}>
              <Text style={styles.productCategory}>{product.category.toUpperCase()}</Text>
              <Text style={styles.productName}>{product.name}</Text>
            </View>
            <View style={styles.productNumbers}>
              <Text style={styles.productPrice}>{formatRupiah(product.price)}</Text>
              <Text style={styles.productStock}>QTY {product.stock}</Text>
            </View>
            <View style={styles.editButton}>
              <Text style={styles.editButtonText}>EDIT</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
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
  productInfo: { flex: 1, paddingRight: 8 },
  productCategory: { color: '#CCFF00', fontSize: 9, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 5 },
  productName: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  productNumbers: { alignItems: 'flex-end', minWidth: 80 },
  productPrice: { color: '#DDD', fontSize: 13, fontWeight: 'bold', marginBottom: 5 },
  productStock: { color: '#777', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  editButton: { backgroundColor: '#141414', paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1, borderColor: '#333', marginLeft: 12 },
  editButtonText: { color: '#CCFF00', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  emptyContainer: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { color: '#444', fontSize: 14, fontWeight: '900', letterSpacing: 1.5 },
});