import React, { useEffect } from 'react';
import { TouchableOpacity, View, ActivityIndicator, Text } from 'react-native';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CashierProvider } from '../context/CashierContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { COLORS } from '../styles/posStyles';

function RootNavigationLayout() {
  const { session, cashierEmail, isLoading } = useAuth();
  const segments = useSegments();

  // Guard routing otomatis
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isAuthenticated = Boolean(session || cashierEmail);

    if (!isAuthenticated && !inAuthGroup) {
      // Belum terautentikasi -> paksa ke halaman login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Sudah login -> arahkan ke halaman utama katalog
      router.replace('/');
    }
  }, [session, cashierEmail, segments, isLoading]);

  const handleBackNavigation = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text
          style={{
            marginTop: 14,
            fontSize: 14,
            fontWeight: '600',
            color: COLORS.textSecondary,
          }}
        >
          Memeriksa sesi kasir...
        </Text>
      </View>
    );
  }

  return (
    <>
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
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />

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
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CashierProvider>
        <RootNavigationLayout />
      </CashierProvider>
    </AuthProvider>
  );
}
