import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useAuthStore } from '@/src/store/auth';
import { colors } from '@/src/theme/colors';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    const inAuth = segments[0] === '(auth)';
    if (!accessToken && !inAuth) {
      router.replace('/(auth)/login');
    } else if (accessToken && inAuth) {
      router.replace('/(tabs)');
    }
  }, [accessToken, hydrated, segments, router]);

  useEffect(() => {
    if (hydrated) SplashScreen.hideAsync();
  }, [hydrated]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider value={navTheme}>
        <StatusBar style="light" />
        <AuthGate>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="transaction/new"
              options={{
                headerShown: true,
                title: 'Nova movimentação',
                presentation: 'modal',
                headerStyle: { backgroundColor: colors.bgElevated },
                headerTintColor: colors.text,
              }}
            />
          </Stack>
        </AuthGate>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
