import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CashierProvider } from '../context/CashierContext';
import { COLORS } from '../styles/posStyles';

export default function RootLayout() {
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
        <Stack.Screen
          name="index"
          options={{
            title: 'Katalog Menu',
            headerShown: false,
          }}
        />

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

        <Stack.Screen
          name="receipt"
          options={{
            title: 'Struk Transaksi',
            headerBackVisible: false,
          }}
        />
      </Stack>
    </CashierProvider>
  );
}

