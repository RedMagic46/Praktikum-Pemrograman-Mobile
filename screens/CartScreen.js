import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { formatRupiah } from '../utils/formatCurrency';

export default function CartScreen({ navigation, cart, setCart }) {
  function increaseQuantity(productId) {
    setCart(cart.map((item) => item.id === productId ? { ...item, quantity: item.quantity + 1 } : item));
  }
  function decreaseQuantity(productId) {
    const updatedCart = cart.map((item) => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
    setCart(updatedCart.filter((item) => item.quantity > 0));
  }
  function removeItem(productId) {
    setCart(cart.filter((item) => item.id !== productId));
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function renderCartItem({ item }) {
    return (
      <View style={styles.cartCard}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(item.id)}>
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemPrice}>{formatRupiah(item.price)}</Text>
        <View style={styles.actionRow}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={() => decreaseQuantity(item.id)}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={() => increaseQuantity(item.id)}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtotal}>{formatRupiah(item.price * item.quantity)}</Text>
        </View>
      </View>
    );
  }

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>CART IS EMPTY_</Text>
        <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Produk')}>
          <Text style={styles.shopButtonText}>BROWSE ITEMS</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.summaryTotal}>{formatRupiah(total)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.checkoutButtonText}>PROCEED TO CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  listContent: { padding: 16, gap: 16 },
  cartCard: { backgroundColor: '#0A0A0A', padding: 16, borderWidth: 1, borderLeftWidth: 4, borderColor: '#222', borderLeftColor: '#CCFF00' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemName: { fontSize: 16, fontWeight: '900', color: '#FFF', flex: 1, letterSpacing: 0.5 },
  removeButton: { backgroundColor: '#FF0055', paddingHorizontal: 12, paddingVertical: 6 },
  removeButtonText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  itemPrice: { fontSize: 14, color: '#888', marginBottom: 16 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderWidth: 1, borderColor: '#333' },
  quantityButton: { paddingHorizontal: 16, paddingVertical: 10 },
  quantityButtonText: { color: '#CCFF00', fontSize: 16, fontWeight: '900' },
  quantityText: { fontSize: 16, fontWeight: 'bold', color: '#FFF', minWidth: 30, textAlign: 'center' },
  subtotal: { fontSize: 18, fontWeight: '900', color: '#CCFF00' },
  summaryContainer: { backgroundColor: '#0A0A0A', padding: 24, borderTopWidth: 1, borderTopColor: '#222' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  summaryLabel: { fontSize: 12, color: '#888', fontWeight: 'bold', letterSpacing: 1 },
  summaryTotal: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  checkoutButton: { backgroundColor: '#CCFF00', padding: 20, alignItems: 'center' },
  checkoutButtonText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24, backgroundColor: '#050505' },
  emptyText: { fontSize: 20, fontWeight: '900', color: '#444', letterSpacing: 2 },
  shopButton: { backgroundColor: '#222', paddingHorizontal: 32, paddingVertical: 16, borderWidth: 1, borderColor: '#444' },
  shopButtonText: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 1 }
});
