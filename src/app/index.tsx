import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,

  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCashier } from '../context/CashierContext';
import { useAuth } from '../context/AuthContext';
import {
  FAKE_STORE_USD_TO_IDR,
  FakeStoreProduct,
  fetchFakeStoreProducts,
} from '../data/fakeStoreApi';
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
  const { products, cart, addToCart, syncApiProducts } = useCashier();
  const { cashierName, cashierEmail, signOut, isSubmitting } = useAuth();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [isConfirmingSignOut, setIsConfirmingSignOut] = useState(false);
  const [apiProducts, setApiProducts] = useState<FakeStoreProduct[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiRequestVersion, setApiRequestVersion] = useState(0);

  const params = useLocalSearchParams<{ category?: ProductCategory }>();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(
    (params.category as ProductCategory) || 'Semua'
  );

  useEffect(() => {
    if (params.category && params.category !== selectedCategory) {
      setSelectedCategory(params.category);
    }
  }, [params.category, selectedCategory]);

  useEffect(() => {
    let active = true;

    async function loadApiProducts() {
      try {
        const fetchedProducts = await fetchFakeStoreProducts();
        if (active) {
          setApiProducts(fetchedProducts);
          syncApiProducts(fetchedProducts);
          setApiError(null);
        }
      } catch (requestError) {
        if (active) {
          setApiError(
            requestError instanceof Error
              ? requestError.message
              : 'Terjadi kesalahan yang tidak diketahui.'
          );
        }
      } finally {
        if (active) {
          setApiLoading(false);
        }
      }
    }

    void loadApiProducts();
    return () => {
      active = false;
    };
  }, [apiRequestVersion, syncApiProducts]);

  function reloadApiProducts(): void {
    setApiLoading(true);
    setApiError(null);
    setApiRequestVersion((version) => version + 1);
  }

  const filteredProducts = useMemo((): Product[] => {
    return filterProducts(products, selectedCategory, searchQuery);
  }, [products, selectedCategory, searchQuery]);

  function handleSelectCategory(categoryName: ProductCategory): void {
    setSelectedCategory(categoryName);
    router.setParams({ category: categoryName });
  }

  const totalCartItems: number = calculateTotalItems(cart);
  const cartSubtotal: number = calculateSubtotal(cart);

  function renderProductItem({ item }: { item: Product }) {
    const isApiProduct = Boolean(item.external);
    const isLowStock = !isApiProduct && item.stock <= 12;

    return (
      <View style={posStyles.productCard}>
        <View style={posStyles.productIconBox}>
          {item.external ? (
            <Image
              source={{ uri: item.external.image }}
              style={{ width: 48, height: 48 }}
              resizeMode="contain"
              accessibilityLabel={item.name}
            />
          ) : (
            <Ionicons name={item.iconName as any} size={30} color={COLORS.primary} />
          )}
        </View>

        <View style={posStyles.productDetails}>
          <Text style={posStyles.productCategoryTag}>
            [{item.external ? `Fake Store · ${item.external.category}` : item.category}]
          </Text>
          <Text style={posStyles.productName}>{item.name}</Text>
          <Text style={posStyles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={posStyles.productBottomRow}>
            <Text style={posStyles.productPrice}>
              {formatCurrency(item.price)}
            </Text>

            {/* Penerapan Inline Styles dinamis berdasarkan status stok */}
            {isApiProduct ? (
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Ionicons name="star" size={13} color={COLORS.accent} />
                  <Text style={posStyles.stockText}>
                    {item.external?.rating.rate.toFixed(1)} (
                    {item.external?.rating.count}) · Stok: {item.stock}
                  </Text>
                </View>
                <Text style={{ color: COLORS.textMuted, fontSize: 10, marginTop: 3 }}>
                  Kurs demo 1 USD = {formatCurrency(FAKE_STORE_USD_TO_IDR)}
                </Text>
              </View>
            ) : (
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
            )}
          </View>
        </View>

        {/* Tombol Tambah ke Keranjang */}
        <TouchableOpacity
          style={posStyles.addButton}
          activeOpacity={0.7}
          onPress={() => addToCart(item)}
          accessibilityRole="button"
          accessibilityLabel={`Tambah ${item.name} ke keranjang`}
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
              // Penerapan router.push(): Menavigasi ke layar '/inventory' dengan menambahkan rute baru ke stack
              onPress={() => router.push('/inventory')}
              activeOpacity={0.7}
            >
              <Ionicons name="cube-outline" size={16} color={COLORS.primary} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textPrimary }}>
                Inventory
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={posStyles.badgeOnline} onPress={() => setProfileModalVisible(true)} activeOpacity={0.8}>
              <View style={posStyles.badgeDot} />
              <Text style={posStyles.badgeText}>{cashierName}</Text>
              <Ionicons name="chevron-down" size={12} color={COLORS.primaryDark} style={{ marginLeft: 3 }} />
            </TouchableOpacity>
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
            placeholder="Cari menu atau produk Fake Store..."
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
                onPress={() => handleSelectCategory(category.name)}
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
        <View>
          <Text style={posStyles.catalogTitle}>Daftar Menu</Text>
          <Text style={posStyles.catalogCount}>
            {filteredProducts.length} Item Ditampilkan
          </Text>
        </View>
        <TouchableOpacity
          onPress={reloadApiProducts}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Muat ulang produk API"
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5, padding: 6 }}
        >
          {apiLoading ? (
            <ActivityIndicator size="small" color={COLORS.secondary} />
          ) : (
            <Ionicons
              name={apiError ? 'alert-circle-outline' : 'refresh'}
              size={17}
              color={apiError ? COLORS.danger : COLORS.secondary}
            />
          )}
          <Text style={{ color: COLORS.secondary, fontSize: 11, fontWeight: '700' }}>
            API {apiProducts.length > 0 ? `· ${apiProducts.length}` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {apiError && (
        <TouchableOpacity
          onPress={reloadApiProducts}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 16,
            marginBottom: 8,
            padding: 10,
            borderRadius: 10,
            backgroundColor: COLORS.dangerLight,
          }}
        >
          <Ionicons name="warning-outline" size={16} color={COLORS.danger} />
          <Text style={{ flex: 1, marginLeft: 7, color: COLORS.danger, fontSize: 12 }}>
            Gagal memuat produk API: {apiError} Ketuk untuk mencoba lagi.
          </Text>
        </TouchableOpacity>
      )}

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

          {/* Penerapan router.push(): Menavigasi ke layar Keranjang & Pembayaran */}
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
      {/* Modal Profil Kasir & Sign Out (Supabase Auth) */}
      <Modal
        visible={profileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setProfileModalVisible(false);
          setIsConfirmingSignOut(false);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 20,
              padding: 24,
              width: '100%',
              maxWidth: 360,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: COLORS.primaryLight,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name="person" size={28} color={COLORS.primary} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.textPrimary }}>
                {cashierName}
              </Text>
              {cashierEmail ? (
                <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 2 }}>
                  {cashierEmail}
                </Text>
              ) : null}
            </View>

            <View
              style={{
                backgroundColor: COLORS.surfaceSubtle,
                borderRadius: 12,
                padding: 12,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 12, color: COLORS.textMuted }}>Status Sesi</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary }} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primaryDark }}>Aktif</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, color: COLORS.textMuted }}>Otorisasi</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.textPrimary }}>Supabase Auth</Text>
              </View>
            </View>

            {isConfirmingSignOut ? (
              <View
                style={{
                  backgroundColor: COLORS.dangerLight,
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: '#FCA5A5',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.danger, marginBottom: 4 }}>
                  Konfirmasi Keluar Sesi
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.danger, marginBottom: 12 }}>
                  Apakah Anda yakin ingin keluar dari akun kasir ini?
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      paddingVertical: 9,
                      borderRadius: 8,
                      backgroundColor: COLORS.surface,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: COLORS.border,
                    }}
                    onPress={() => setIsConfirmingSignOut(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textSecondary }}>Batal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      paddingVertical: 9,
                      borderRadius: 8,
                      backgroundColor: COLORS.danger,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 4,
                    }}
                    disabled={isSubmitting}
                    onPress={async () => {
                      setIsConfirmingSignOut(false);
                      setProfileModalVisible(false);
                      await signOut();
                      router.replace('/(auth)/login');
                    }}
                    activeOpacity={0.8}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color={COLORS.textLight} />
                    ) : (
                      <>
                        <Ionicons name="log-out-outline" size={15} color={COLORS.textLight} />
                        <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textLight }}>Ya, Keluar</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: COLORS.surfaceSubtle,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                  onPress={() => {
                    setProfileModalVisible(false);
                    setIsConfirmingSignOut(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.textSecondary }}>Tutup</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1.2,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: COLORS.danger,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 6,
                  }}
                  disabled={isSubmitting}
                  onPress={() => setIsConfirmingSignOut(true)}
                  activeOpacity={0.8}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={COLORS.textLight} />
                  ) : (
                    <>
                      <Ionicons name="log-out-outline" size={16} color={COLORS.textLight} />
                      <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.textLight }}>Keluar</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
