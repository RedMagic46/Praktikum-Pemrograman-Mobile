import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCashier } from '../context/CashierContext';
import { CATEGORIES } from '../data/products';
import { Product, ProductCategory } from '../types/cashier';
import {
  formatCurrency,
  filterProducts,
  calculateSubtotal,
  calculateTotalItems,
} from '../utils/cashierUtils';
import { posStyles, COLORS } from '../styles/posStyles';

export default function CashierCatalogScreen() {
  const { products, cart, addToCart } = useCashier();

  // State pencarian dan filter kategori
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');

  // Filter produk menggunakan custom function filterProducts
  const filteredProducts: Product[] = filterProducts(products, selectedCategory, searchQuery);

  // Perhitungan total di keranjang untuk floating bar
  const totalCartItems: number = calculateTotalItems(cart);
  const cartSubtotal: number = calculateSubtotal(cart);

  /**
   * Custom function untuk me-render setiap kartu produk dalam FlatList
   * Menerapkan perpaduan External Styles dan Inline Styles dinamis
   */
  function renderProductItem({ item }: { item: Product }) {
    // Mengecek apakah stok menipis (dibawah atau sama dengan 12)
    const isLowStock = item.stock <= 12;

    return (
      <View style={posStyles.productCard}>
        {/* Box Icon Produk */}
        <View style={posStyles.productIconBox}>
          <Ionicons
            name={item.iconName as any}
            size={30}
            color={COLORS.primary}
          />
        </View>

        {/* Informasi Detail Produk */}
        <View style={posStyles.productDetails}>
          <Text style={posStyles.productCategoryTag}>[{item.category}]</Text>
          <Text style={posStyles.productName}>{item.name}</Text>
          <Text style={posStyles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={posStyles.productBottomRow}>
            <Text style={posStyles.productPrice}>{formatCurrency(item.price)}</Text>

            {/* Penerapan Inline Styles dinamis berdasarkan status stok */}
            <View
              style={[
                posStyles.stockBadge,
                {
                  backgroundColor: isLowStock ? '#FEE2E2' : '#ECFDF5',
                  borderColor: isLowStock ? '#FCA5A5' : '#A7F3D0',
                  borderWidth: 1,
                },
              ]}
            >
              <Text
                style={[
                  posStyles.stockText,
                  { color: isLowStock ? '#DC2626' : '#059669' },
                ]}
              >
                {isLowStock ? `Sisa: ${item.stock}` : `Stok: ${item.stock}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Tombol Tambah ke Keranjang */}
        <TouchableOpacity
          style={posStyles.addButton}
          activeOpacity={0.7}
          onPress={() => addToCart(item)}
        >
          <Ionicons name="add" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={posStyles.container}>
      {/* Header Aplikasi KasirKu */}
      <View style={posStyles.header}>
        <View style={posStyles.headerTop}>
          <View style={posStyles.brandRow}>
            <View style={posStyles.brandIconWrapper}>
              <Ionicons name="storefront" size={24} color={COLORS.primary} />
            </View>
            <View>
              <Text style={posStyles.brandTitle}>KasirKu</Text>
              <Text style={posStyles.brandSubtitle}>Point of Sales Retail & Cafe</Text>
            </View>
          </View>

          {/* Aksi Header: Tombol Inventory & Status Kasir */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: COLORS.surfaceSubtle,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: COLORS.border,
                gap: 5,
              }}
              onPress={() => router.push('/inventory')}
              activeOpacity={0.7}
            >
              <Ionicons name="cube-outline" size={16} color={COLORS.primary} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textPrimary }}>
                Inventory
              </Text>
            </TouchableOpacity>

            <View style={posStyles.badgeOnline}>
              <View style={posStyles.badgeDot} />
              <Text style={posStyles.badgeText}>Kasir 01</Text>
            </View>
          </View>
        </View>

        {/* Search Input Bar */}
        <View style={posStyles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.textMuted}
            style={posStyles.searchIcon}
          />
          <TextInput
            style={posStyles.searchInput}
            placeholder="Cari menu makanan, minuman, snack..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={posStyles.clearButton}
            >
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Kategori Menu Menggunakan .map() Loop */}
      <View style={posStyles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={posStyles.categoryListContent}
        >
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.name;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  posStyles.categoryChip,
                  isSelected && posStyles.categoryChipActive,
                  // Contoh Inline Style untuk efek bayangan/highlight ketika dipilih
                  {
                    transform: [{ scale: isSelected ? 1.02 : 1 }],
                  },
                ]}
                onPress={() => setSelectedCategory(category.name)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={category.icon as any}
                  size={16}
                  color={isSelected ? COLORS.textLight : COLORS.textSecondary}
                />
                <Text
                  style={[
                    posStyles.categoryChipText,
                    isSelected && posStyles.categoryChipTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Header Katalog Info */}
      <View style={posStyles.catalogHeader}>
        <Text style={posStyles.catalogTitle}>Daftar Menu</Text>
        <Text style={posStyles.catalogCount}>
          {filteredProducts.length} Item Ditampilkan
        </Text>
      </View>

      {/* FlatList Produk Kasir */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
        contentContainerStyle={posStyles.productListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={posStyles.emptyState}>
            <Ionicons name="search" size={48} color={COLORS.textMuted} />
            <Text style={posStyles.emptyStateTitle}>Menu Tidak Ditemukan</Text>
            <Text style={posStyles.emptyStateSubtitle}>
              Coba gunakan kata kunci lain atau pilih kategori Semua.
            </Text>
          </View>
        }
      />

      {/* Floating Cart Bar (Muncul ketika keranjang ada isinya) */}
      {totalCartItems > 0 && (
        <View style={posStyles.floatingCartBar}>
          <View style={posStyles.floatingCartLeft}>
            <View style={posStyles.floatingCartBadge}>
              <Text style={posStyles.floatingCartCount}>{totalCartItems}</Text>
            </View>
            <View>
              <Text style={posStyles.floatingCartLabel}>Total Belanja</Text>
              <Text style={posStyles.floatingCartTotal}>
                {formatCurrency(cartSubtotal)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={posStyles.floatingCartButton}
            onPress={() => router.push('/cart')}
            activeOpacity={0.8}
          >
            <Text style={posStyles.floatingCartButtonText}>Bayar Sekarang</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
