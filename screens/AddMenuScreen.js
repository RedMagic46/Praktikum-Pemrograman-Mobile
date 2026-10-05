import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const categories = ['Makanan', 'Minuman'];

export default function AddMenuScreen({ navigation, addProduct }) {
  const [category, setCategory] = useState(categories[0]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  function submitProduct() {
    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(price);

    if (!name.trim() || !Number.isInteger(parsedQuantity) || parsedQuantity <= 0 || !Number.isInteger(parsedPrice) || parsedPrice <= 0) {
      setError('Isi nama, quantity, dan harga dengan nilai yang valid.');
      return;
    }

    addProduct({ name: name.trim(), category, stock: parsedQuantity, price: parsedPrice });
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.eyebrow}>KATALOG / TAMBAH ITEM</Text>
      <Text style={styles.heading}>Menu baru</Text>

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
            <Text style={[styles.categoryText, category === item && styles.categoryTextSelected]}>{item.toUpperCase()}</Text>
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
          <Text style={styles.fieldLabel}>QUANTITY</Text>
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
      <TouchableOpacity style={styles.submitButton} onPress={submitProduct}>
        <Text style={styles.submitText}>+ TAMBAHKAN MENU</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  content: { padding: 16, paddingBottom: 32 },
  eyebrow: { color: '#CCFF00', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
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
  submitButton: { backgroundColor: '#CCFF00', minHeight: 52, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  submitText: { color: '#050505', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
});