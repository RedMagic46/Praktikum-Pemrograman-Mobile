import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthResponse {
  error: string | null;
  needsEmailConfirmation?: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  cashierName: string;
  cashierEmail: string;
  isLoading: boolean;
  isSubmitting: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, name: string) => Promise<AuthResponse>;
  signOut: () => Promise<AuthResponse>;
  demoLogin: (name?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [demoUser, setDemoUser] = useState<{ name: string; email: string } | null>(null);

  // Ambil sesi awal & dengarkan perubahan status autentikasi dari Supabase
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        if (!isSupabaseConfigured) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Gagal memuat sesi Supabase:', error.message);
        }

        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          setIsLoading(false);
        }
      } catch (err) {
        console.warn('Inisialisasi auth gagal:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession) {
          setDemoUser(null);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const getCashierName = useCallback((): string => {
    if (demoUser) {
      return demoUser.name;
    }
    if (!user) {
      return 'Kasir 01';
    }
    const meta = user.user_metadata;
    if (meta?.full_name && typeof meta.full_name === 'string') {
      return meta.full_name.trim();
    }
    if (meta?.cashier_name && typeof meta.cashier_name === 'string') {
      return meta.cashier_name.trim();
    }
    if (user.email) {
      const emailPrefix = user.email.split('@')[0];
      return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }
    return 'Kasir 01';
  }, [user, demoUser]);

  const getCashierEmail = useCallback((): string => {
    if (demoUser) {
      return demoUser.email;
    }
    return user?.email ?? '';
  }, [user, demoUser]);

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    if (!isSupabaseConfigured) {
      return {
        error:
          'Kredensial Supabase belum diatur di file .env. Silakan isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY.',
      };
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: mapAuthErrorMessage(error) };
      }

      setSession(data.session);
      setUser(data.user);
      setDemoUser(null);
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Terjadi kegagalan saat proses login.',
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> => {
    if (!isSupabaseConfigured) {
      return {
        error:
          'Kredensial Supabase belum diatur di file .env. Silakan isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY.',
      };
    }

    setIsSubmitting(true);
    try {
      const cleanName = name.trim();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: cleanName,
            cashier_name: cleanName,
          },
        },
      });

      if (error) {
        return { error: mapAuthErrorMessage(error) };
      }

      // Jika user dibuat tapi session null, artinya Supabase meminta konfirmasi email
      const needsEmailConfirmation = !data.session;

      return {
        error: null,
        needsEmailConfirmation,
      };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Terjadi kegagalan saat proses pendaftaran.',
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const signOut = async (): Promise<AuthResponse> => {
    setIsSubmitting(true);
    try {
      setDemoUser(null);
      setSession(null);
      setUser(null);

      if (isSupabaseConfigured) {
        try {
          await supabase.auth.signOut();
        } catch (supabaseErr) {
          console.warn('Peringatan saat supabase signOut:', supabaseErr);
        }
      }

      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Gagal keluar dari sesi.',
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mode Demo berguna saat pengguna ingin mencoba alur sebelum menghubungkan Supabase asli
  const demoLogin = (name = 'Kasir Demo') => {
    setDemoUser({
      name,
      email: 'demo.kasir@kasirku.local',
    });
  };

  const value: AuthContextType = {
    session,
    user,
    cashierName: getCashierName(),
    cashierEmail: getCashierEmail(),
    isLoading,
    isSubmitting,
    isConfigured: isSupabaseConfigured,
    signIn,
    signUp,
    signOut,
    demoLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}

function mapAuthErrorMessage(error: AuthError): string {
  const msg = error.message.toLowerCase();
  if (msg.includes('invalid login credentials') || msg.includes('invalid_grant')) {
    return 'Email atau kata sandi tidak sesuai. Silakan periksa kembali.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Email belum dikonfirmasi. Periksa kotak masuk/spam email Anda.';
  }
  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'Email sudah terdaftar. Silakan gunakan email lain atau langsung masuk.';
  }
  if (msg.includes('password should be at least')) {
    return 'Kata sandi minimal harus 6 karakter.';
  }
  if (msg.includes('network request failed')) {
    return 'Koneksi internet bermasalah. Periksa jaringan Anda.';
  }
  return error.message;
}
