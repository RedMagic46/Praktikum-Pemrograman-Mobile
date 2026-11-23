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

export default function RegisterScreen() {
  const { signUp, isSubmitting } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Nama kasir wajib diisi.');
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Email dan kata sandi wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const { error, needsEmailConfirmation } = await signUp(email, password, name);

    if (error) {
      setErrorMessage(error);
      return;
    }

    if (needsEmailConfirmation) {
      Alert.alert(
        'Pendaftaran Berhasil!',
        'Akun kasir Anda telah terdaftar. Silakan periksa email untuk konfirmasi akun, lalu masuk kembali.',
        [
          {
            text: 'Ke Halaman Masuk',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } else {
      Alert.alert(
        'Pendaftaran Berhasil!',
        `Akun kasir "${name.trim()}" telah berhasil dibuat. Silakan masuk dengan akun Anda.`,
        [
          {
            text: 'Masuk Sekarang',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    }
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
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              marginBottom: 16,
              alignSelf: 'flex-start',
            }}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
            <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 13 }}>
              Kembali ke Login
            </Text>
          </TouchableOpacity>

          <View style={authStyles.brandBox}>
            <View style={authStyles.brandIconWrapper}>
              <Ionicons name="person-add" size={28} color={COLORS.primary} />
            </View>
            <Text style={authStyles.brandTitle}>Daftar Akun Kasir</Text>
            <Text style={authStyles.brandSubtitle}>
              Buat akun baru untuk mulai mengelola kasir dan transaksi
            </Text>
          </View>

          {errorMessage && (
            <View style={authStyles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
              <Text style={authStyles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <View style={authStyles.formGroup}>
            <Text style={authStyles.label}>Nama Kasir</Text>
            <View style={authStyles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={18}
                color={COLORS.textMuted}
                style={authStyles.inputIcon}
              />
              <TextInput
                style={authStyles.input}
                placeholder="Contoh: Ahmad Kasir"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errorMessage) setErrorMessage(null);
                }}
              />
            </View>
          </View>

          <View style={authStyles.formGroup}>
            <Text style={authStyles.label}>Email</Text>
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

          <View style={authStyles.formGroup}>
            <Text style={authStyles.label}>Konfirmasi Kata Sandi</Text>
            <View style={authStyles.inputWrapper}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color={COLORS.textMuted}
                style={authStyles.inputIcon}
              />
              <TextInput
                style={authStyles.input}
                placeholder="Ulangi kata sandi"
                placeholderTextColor={COLORS.textMuted}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              authStyles.primaryButton,
              isSubmitting && authStyles.primaryButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.textLight} size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textLight} />
                <Text style={authStyles.primaryButtonText}>Daftar Akun Kasir</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={authStyles.switchAuthRow}>
            <Text style={authStyles.switchAuthText}>Sudah punya akun kasir?</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={authStyles.switchAuthLink}>Masuk di sini</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
