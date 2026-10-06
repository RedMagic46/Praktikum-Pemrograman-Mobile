import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const defaultCategories = ['Makanan', 'Minuman', 'Snack'];

export default function EditMenuScreen({ route, navigation, updateProduct, deleteProduct }) {
  const product = route.params?.product;

  const categories = product && !defaultCategories.includes(product.category)
    ? [...defaultCategories, product.category]
    : defaultCategories;

  const [category, setCategory] = useState(product?.category || defaultCategories[0]);
  const [name, setName] = useState(product?.name || '');
  const [quantity, setQuantity] = useState(product?.stock !== undefined ? product.stock.toString() : '');
  const [price, setPrice] = useState(product?.price !== undefined ? product.price.toString() : '');
  const [error, setError] = useState('');

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.errorText}>Data produk tidak ditemukan.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>KEMBALI</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function handleSave() {
    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(price);

    if (
      !name.trim() ||
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 0 ||
      !Number.isInteger(parsedPrice) ||
      parsedPrice <= 0
    ) {
      setError('Isi nama, quantity (minimal 0), dan harga dengan nilai yang valid.');
      return;
    }

    updateProduct({
      id: product.id,
      name: name.trim(),
      category,
      stock: parsedQuantity,
      price: parsedPrice,
    });

    navigation.goBack();
  }

  function handleDelete() {
    Alert.alert(
      'HAPUS MENU',
      `Yakin ingin menghapus "${product.name}" dari daftar inventory?`,
      [
        { text: 'BATAL', style: 'cancel' },
        {
          text: 'HAPUS',
          style: 'destructive',
          onPress: () => {
            if (deleteProduct) {
              deleteProduct(product.id);
            }
            navigation.goBack();
          },
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.headerRow}>
        <Text style={styles.eyebrow}>KATALOG / EDIT ITEM</Text>
        <Text style={styles.idBadge}>ID #{product.id}</Text>
      </View>
      <Text style={styles.heading}>Edit Menu</Text>

      <Text style={styles.fieldLabel}>KATEGORI</Text>
      <View style={styles.categoryRow}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: category === item }}
            style={[styles.categoryButton, category === item && styles.categoryButtonSelected]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.categoryText, category === item && styles.categoryTextSelected]}>
              {item.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.fieldLabel}>NAMA MENU</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: Soto Ayam"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        returnKeyType="next"
      />

      <View style={styles.numberRow}>
        <View style={styles.numberField}>
          <Text style={styles.fieldLabel}>QUANTITY / STOK</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#666"
            value={quantity}
            onChangeText={(value) => setQuantity(value.replace(/\D/g, ''))}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.numberField}>
          <Text style={styles.fieldLabel}>HARGA (RP)</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#666"
            value={price}
            onChangeText={(value) => setPrice(value.replace(/\D/g, ''))}
            keyboardType="number-pad"
          />
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
        <Text style={styles.submitText}>SIMPAN PERUBAHAN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>HAPUS MENU DARI INVENTORY</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  eyebrow: { color: '#CCFF00', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  idBadge: { color: '#666', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  heading: { color: '#FFF', fontSize: 26, fontWeight: '900', marginBottom: 24 },
  fieldLabel: { color: '#888', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 8, marginTop: 16 },
  categoryRow: { flexDirection: 'row', gap: 10 },
  categoryButton: { flex: 1, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#333', backgroundColor: '#0A0A0A' },
  categoryButtonSelected: { borderColor: '#CCFF00', backgroundColor: '#CCFF00' },
  categoryText: { color: '#AAA', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  categoryTextSelected: { color: '#050505' },
  input: { minHeight: 50, paddingHorizontal: 14, backgroundColor: '#0A0A0A', borderWidth: 1, borderColor: '#333', color: '#FFF', fontSize: 15 },
  numberRow: { flexDirection: 'row', gap: 12 },
  numberField: { flex: 1 },
  errorText: { color: '#FF7A6B', fontSize: 12, marginTop: 14 },
  submitButton: { backgroundColor: '#CCFF00', minHeight: 52, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  submitText: { color: '#050505', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  deleteButton: { backgroundColor: '#1A080A', minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 12, borderWidth: 1, borderColor: '#FF0055' },
  deleteText: { color: '#FF0055', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  emptyContainer: { flex: 1, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center', padding: 24 },
  backButton: { marginTop: 16, backgroundColor: '#222', paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1, borderColor: '#444' },
  backButtonText: { color: '#FFF', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
});
