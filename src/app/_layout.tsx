import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CashierProvider } from '../context/CashierContext';
import { COLORS } from '../styles/posStyles';

/**
 * RootLayout (_layout.tsx):
 * Mengatur hierarki tata letak global untuk seluruh rute aplikasi menggunakan Expo Router Stack.
 * Menggunakan komponen <Stack> dan <Stack.Screen> untuk mendaftarkan dan mengonfigurasi tiap layar.
 */
export default function RootLayout() {
  /**
   * Helper navigasi kembali dengan validasi riwayat stack
   * Menggunakan router.canGoBack() dan router.back()
   */
  const handleBackNavigation = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <CashierProvider>
      <StatusBar style="dark" />
      {/* Komponen <Stack> sebagai navigator stack utama */}
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 17,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        {/* <Stack.Screen> untuk layar Katalog Utama (index) */}
        <Stack.Screen
          name="index"
          options={{
            title: 'Katalog Menu',
            headerShown: false,
          }}
        />

        {/* <Stack.Screen> untuk layar Keranjang & Checkout (cart) */}
        <Stack.Screen
          name="cart"
          options={{
            title: 'Kasir & Pembayaran',
            headerBackTitle: 'Katalog',
            headerLeft: () => (
              <TouchableOpacity
                onPress={handleBackNavigation}
                style={{ marginRight: 12, padding: 4 }}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            ),
          }}
        />

        {/* <Stack.Screen> untuk layar Manajemen Stok (inventory) */}
        <Stack.Screen
          name="inventory"
          options={{
            title: 'Kelola Inventory Menu',
            headerBackTitle: 'Katalog',
            headerLeft: () => (
              <TouchableOpacity
                onPress={handleBackNavigation}
                style={{ marginRight: 12, padding: 4 }}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            ),
          }}
        />

        {/* <Stack.Screen> untuk layar Struk Transaksi (receipt) */}
        <Stack.Screen
          name="receipt"
          options={{
            title: 'Struk Transaksi',
            headerBackVisible: false, // Menghilangkan tombol back agar tidak kembali ke transaksi yang sudah lunas
          }}
        />
      </Stack>
    </CashierProvider>
  );
}

