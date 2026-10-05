import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { formatRupiah } from '../utils/formatCurrency';

export default function ProductScreen({ navigation, products, cart, setCart }) {
  const [searchText, setSearchText] = useState('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  const totalItemInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  function renderProduct({ item }) {
    return (
      <View style={styles.productCard}>
        <View style={styles.productInfo}>
          <Text style={styles.productCategory}>[ {item.category.toUpperCase()} ]</Text>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>{formatRupiah(item.price)}</Text>
            <Text style={styles.productStock}>QTY:{item.stock}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="SEARCH ITEM..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContent}
      />
      {totalItemInCart > 0 && (
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Keranjang')}>
          <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{totalItemInCart}</Text></View>
          <Text style={styles.cartButtonText}>VIEW CART</Text>
          <Text style={styles.cartArrow}>→</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  searchContainer: { padding: 16, backgroundColor: '#050505', borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  searchInput: { backgroundColor: '#0A0A0A', color: '#FFF', padding: 16, fontSize: 14, borderWidth: 1, borderColor: '#333', fontWeight: 'bold', letterSpacing: 1 },
  listContent: { padding: 16, gap: 16 },
  productCard: { backgroundColor: '#0A0A0A', padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  productInfo: { flex: 1 },
  productCategory: { fontSize: 10, color: '#CCFF00', fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  productName: { fontSize: 18, fontWeight: '900', color: '#FFF', marginBottom: 8, letterSpacing: 0.5 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#AAA' },
  productStock: { fontSize: 10, color: '#444', fontWeight: 'bold', letterSpacing: 1 },
  addButton: { backgroundColor: '#222', paddingVertical: 12, paddingHorizontal: 20, borderWidth: 1, borderColor: '#444' },
  addButtonText: { color: '#FFF', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  cartButton: { backgroundColor: '#CCFF00', margin: 16, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cartBadge: { backgroundColor: '#000', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  cartBadgeText: { color: '#CCFF00', fontWeight: 'bold', fontSize: 14 },
  cartButtonText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  cartArrow: { color: '#000', fontSize: 20, fontWeight: 'bold' }
});
