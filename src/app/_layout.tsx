import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CashierProvider } from '../context/CashierContext';
import { COLORS } from '../styles/posStyles';

export default function RootLayout() {
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
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="cart"
          options={{
            title: 'Kasir & Pembayaran',
            headerBackTitle: 'Katalog',
          }}
        />
        <Stack.Screen
          name="inventory"
          options={{
            title: 'Kelola Inventory Menu',
            headerBackTitle: 'Katalog',
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
