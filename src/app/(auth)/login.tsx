import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { authStyles } from '../../styles/authStyles';
import { COLORS } from '../../styles/posStyles';

export default function LoginScreen() {
  const { signIn, isSubmitting, isConfigured, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Silakan isi email dan kata sandi.');
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      setErrorMessage(error);
    }
    // Jika sukses, AuthContext akan update session dan _layout akan auto redirect ke '/'
  };

  const handleDemoAccess = () => {
    demoLogin('Kasir Demo (Offline)');
    Alert.alert(
      'Mode Demo Diaktifkan',
      'Anda masuk dengan akun Demo Kasir. Kredensial Supabase dapat dikonfigurasi kapan saja di file .env.'
    );
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={authStyles.card}>
          <View style={authStyles.brandBox}>
            <View style={authStyles.brandIconWrapper}>
              <Ionicons name="storefront" size={32} color={COLORS.primary} />
            </View>
            <Text style={authStyles.brandTitle}>KasirKu</Text>
            <Text style={authStyles.brandSubtitle}>
              Masuk untuk memulai sesi transaksi penjualan
            </Text>
          </View>

          {!isConfigured && (
            <View style={authStyles.configNotice}>
              <Text style={authStyles.configNoticeTitle}>
                ℹ️ Setup Supabase (.env)
              </Text>
              <Text style={authStyles.configNoticeText}>
                File .env masih menggunakan placeholder. Anda bisa mengisinya dengan Project URL & Anon Key Supabase asli, atau gunakan mode demo untuk mencoba tampilan kasir sekarang.
              </Text>
              <TouchableOpacity
                style={authStyles.demoButton}
                onPress={handleDemoAccess}
                activeOpacity={0.8}
              >
                <Text style={authStyles.demoButtonText}>Coba Mode Demo Kasir</Text>
              </TouchableOpacity>
            </View>
          )}

          {errorMessage && (
            <View style={authStyles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
              <Text style={authStyles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <View style={authStyles.formGroup}>
            <Text style={authStyles.label}>Email Kasir</Text>
            <View style={authStyles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={COLORS.textMuted}
                style={authStyles.inputIcon}
              />
              <TextInput
                style={authStyles.input}
                placeholder="nama@kasirku.id"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={authStyles.formGroup}>
            <Text style={authStyles.label}>Kata Sandi</Text>
            <View style={authStyles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={COLORS.textMuted}
                style={authStyles.inputIcon}
              />
              <TextInput
                style={authStyles.input}
                placeholder="Minimal 6 karakter"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              authStyles.primaryButton,
              isSubmitting && authStyles.primaryButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.textLight} size="small" />
            ) : (
              <>
                <Ionicons name="log-in-outline" size={20} color={COLORS.textLight} />
                <Text style={authStyles.primaryButtonText}>Masuk ke KasirKu</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={authStyles.switchAuthRow}>
            <Text style={authStyles.switchAuthText}>Belum punya akun kasir?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={authStyles.switchAuthLink}>Daftar Sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
