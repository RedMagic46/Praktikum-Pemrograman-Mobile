import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCashier } from '../context/CashierContext';
import { Product, ProductCategory } from '../types/cashier';
import { formatCurrency, filterProducts } from '../utils/cashierUtils';
import { CATEGORIES } from '../data/products';
import { inventoryStyles } from '../styles/inventoryStyles';
import { COLORS } from '../styles/posStyles';

export default function InventoryScreen() {
  const { products, addProduct, updateProduct, deleteProduct, adjustStock } = useCashier();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');

  // Modal Form states
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [formName, setFormName] = useState<string>('');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formStock, setFormStock] = useState<string>('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Makanan');
  const [formDescription, setFormDescription] = useState<string>('');

  // Perhitungan Statistik Inventory
  const totalMenuCount: number = products.length;
  const totalPhysicalStock: number = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount: number = products.filter((p) => p.stock < 15).length;

  const filteredProducts = filterProducts(products, selectedCategory, searchQuery);

  /**
   * Buka form untuk menambah menu baru
   */
  function handleOpenAddModal(): void {
    setEditingProduct(null);
    setFormName('');
    setFormPrice('');
    setFormStock('');
    setFormCategory('Makanan');
    setFormDescription('');
    setModalVisible(true);
  }

  /**
   * Buka form untuk mengedit produk yang sudah ada
   */
  function handleOpenEditModal(product: Product): void {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormStock(product.stock.toString());
    setFormCategory(product.category);
    setFormDescription(product.description);
    setModalVisible(true);
  }

  /**
   * Menyimpan data produk (Tambah atau Edit)
   */
  function handleSaveProduct(): void {
    if (!formName.trim()) {
      Alert.alert('Data Belum Lengkap', 'Nama produk wajib diisi.');
      return;
    }

    const priceNum = parseFloat(formPrice.replace(/[^0-9]/g, '')) || 0;
    const stockNum = parseInt(formStock.replace(/[^0-9]/g, ''), 10) || 0;

    if (priceNum <= 0) {
      Alert.alert('Harga Tidak Valid', 'Harga produk harus lebih dari Rp 0.');
      return;
    }

    if (editingProduct) {
      // Mode Edit
      updateProduct({
        ...editingProduct,
        name: formName.trim(),
        price: priceNum,
        stock: stockNum,
        category: formCategory,
        description: formDescription.trim(),
      });
      Alert.alert('Sukses', `Menu "${formName}" berhasil diperbarui.`);
    } else {
      // Mode Tambah
      addProduct({
        name: formName.trim(),
        price: priceNum,
        stock: stockNum,
        category: formCategory,
        description: formDescription.trim(),
        iconName:
          formCategory === 'Minuman'
            ? 'cafe-outline'
            : formCategory === 'Snack'
            ? 'fast-food'
            : formCategory === 'Paket'
            ? 'gift-outline'
            : 'restaurant',
      });
      Alert.alert('Sukses', `Menu "${formName}" berhasil ditambahkan.`);
    }

    setModalVisible(false);
  }

  /**
   * Konfirmasi sebelum menghapus produk
   */
  function confirmDeleteProduct(product: Product): void {
    Alert.alert(
      'Hapus Menu',
      `Yakin ingin menghapus menu "${product.name}" dari sistem KasirKu?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => deleteProduct(product.id),
        },
      ]
    );
  }

  /**
   * Render item produk dalam inventory
   */
  function renderInventoryItem({ item }: { item: Product }) {
    const isCritical = item.stock <= 10;

    return (
      <View style={inventoryStyles.inventoryCard}>
        <View style={inventoryStyles.cardTopRow}>
          <View style={inventoryStyles.iconBox}>
            <Ionicons
              name={item.iconName as any}
              size={24}
              color={COLORS.primary}
            />
          </View>

          <View style={inventoryStyles.cardMainInfo}>
            <Text style={inventoryStyles.cardCategory}>[{item.category}]</Text>
            <Text style={inventoryStyles.cardTitle}>{item.name}</Text>
            <Text style={inventoryStyles.cardPrice}>
              {formatCurrency(item.price)}
            </Text>
          </View>
        </View>

        {/* Baris Kontrol Stok & Aksi */}
        <View style={inventoryStyles.cardControlsRow}>
          {/* Kontrol Penyesuaian Stok Cepat */}
          <View style={inventoryStyles.stockControl}>
            <TouchableOpacity
              style={inventoryStyles.stockBtn}
              onPress={() => adjustStock(item.id, -1)}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <Text
              style={[
                inventoryStyles.stockNumber,
                // Inline Style untuk peringatan stok menipis
                { color: isCritical ? COLORS.danger : COLORS.textPrimary },
              ]}
            >
              {item.stock}
            </Text>

            <TouchableOpacity
              style={inventoryStyles.stockBtn}
              onPress={() => adjustStock(item.id, 1)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Tombol Edit dan Hapus */}
          <View style={inventoryStyles.actionBtnsRow}>
            <TouchableOpacity
              style={inventoryStyles.editBtn}
              onPress={() => handleOpenEditModal(item)}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil-outline" size={14} color={COLORS.textSecondary} />
              <Text style={inventoryStyles.editBtnText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={inventoryStyles.deleteBtn}
              onPress={() => confirmDeleteProduct(item)}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={15} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={inventoryStyles.container}>
      {/* Kartu Ringkasan Stok (Statistik Inventory) */}
      <View style={inventoryStyles.statsContainer}>
        <View style={inventoryStyles.statCard}>
          <Text style={inventoryStyles.statLabel}>Total Menu</Text>
          <Text style={inventoryStyles.statValue}>{totalMenuCount}</Text>
        </View>
        <View style={inventoryStyles.statCard}>
          <Text style={inventoryStyles.statLabel}>Total Stok</Text>
          <Text style={inventoryStyles.statValue}>{totalPhysicalStock}</Text>
        </View>
        <View
          style={[
            inventoryStyles.statCard,
            { backgroundColor: lowStockCount > 0 ? '#FEF2F2' : COLORS.surfaceSubtle },
          ]}
        >
          <Text style={[inventoryStyles.statLabel, { color: lowStockCount > 0 ? COLORS.danger : COLORS.textSecondary }]}>
            Stok &lt; 15
          </Text>
          <Text
            style={[
              inventoryStyles.statValue,
              { color: lowStockCount > 0 ? COLORS.danger : COLORS.textPrimary },
            ]}
          >
            {lowStockCount}
          </Text>
        </View>
      </View>

      {/* Toolbar Pencarian & Tambah Menu */}
      <View style={inventoryStyles.toolbar}>
        <View style={inventoryStyles.searchBox}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={inventoryStyles.searchInput}
            placeholder="Cari menu di inventory..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={inventoryStyles.addMenuBtn}
          onPress={handleOpenAddModal}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color={COLORS.textLight} />
          <Text style={inventoryStyles.addMenuBtnText}>Menu Baru</Text>
        </TouchableOpacity>
      </View>

      {/* Daftar Produk Inventory Menggunakan FlatList */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderInventoryItem}
        contentContainerStyle={inventoryStyles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal Dialog Form Tambah / Edit Produk */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={inventoryStyles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={inventoryStyles.modalContent}>
            <View style={inventoryStyles.modalHeader}>
              <Text style={inventoryStyles.modalTitle}>
                {editingProduct ? 'Edit Menu Kasir' : 'Tambah Menu Baru'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={inventoryStyles.formGroup}>
                <Text style={inventoryStyles.formLabel}>Nama Menu / Produk</Text>
                <TextInput
                  style={inventoryStyles.formInput}
                  placeholder="Contoh: Es Kopi Susu Aren"
                  value={formName}
                  onChangeText={setFormName}
                />
              </View>

              <View style={inventoryStyles.formGroup}>
                <Text style={inventoryStyles.formLabel}>Kategori</Text>
                <View style={inventoryStyles.categoryChipRow}>
                  {(['Makanan', 'Minuman', 'Snack', 'Paket'] as ProductCategory[]).map(
                    (cat) => {
                      const isSelected = formCategory === cat;
                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            inventoryStyles.modalCategoryChip,
                            isSelected && inventoryStyles.modalCategoryChipActive,
                          ]}
                          onPress={() => setFormCategory(cat)}
                        >
                          <Text
                            style={[
                              inventoryStyles.modalCategoryChipText,
                              isSelected && inventoryStyles.modalCategoryChipTextActive,
                            ]}
                          >
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  )}
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[inventoryStyles.formGroup, { flex: 1 }]}>
                  <Text style={inventoryStyles.formLabel}>Harga (Rp)</Text>
                  <TextInput
                    style={inventoryStyles.formInput}
                    placeholder="15000"
                    keyboardType="numeric"
                    value={formPrice}
                    onChangeText={setFormPrice}
                  />
                </View>

                <View style={[inventoryStyles.formGroup, { flex: 1 }]}>
                  <Text style={inventoryStyles.formLabel}>Jumlah Stok</Text>
                  <TextInput
                    style={inventoryStyles.formInput}
                    placeholder="20"
                    keyboardType="numeric"
                    value={formStock}
                    onChangeText={setFormStock}
                  />
                </View>
              </View>

              <View style={inventoryStyles.formGroup}>
                <Text style={inventoryStyles.formLabel}>Deskripsi Singkat</Text>
                <TextInput
                  style={[inventoryStyles.formInput, inventoryStyles.formInputMultiline]}
                  placeholder="Keterangan rasa, porsi, atau bahan..."
                  multiline
                  numberOfLines={3}
                  value={formDescription}
                  onChangeText={setFormDescription}
                />
              </View>

              <View style={inventoryStyles.modalActions}>
                <TouchableOpacity
                  style={inventoryStyles.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={inventoryStyles.cancelBtnText}>Batal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={inventoryStyles.saveBtn}
                  onPress={handleSaveProduct}
                  activeOpacity={0.8}
                >
                  <Text style={inventoryStyles.saveBtnText}>
                    {editingProduct ? 'Simpan Perubahan' : 'Tambahkan Menu'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
