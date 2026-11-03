import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { authApi } from '@/src/api/finance';
import { Button, Input, Label, Screen, Subtitle, Title } from '@/src/components/ui';
import { useAuthStore } from '@/src/store/auth';
import { colors } from '@/src/theme/colors';

export default function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState('demo@noxfinance.app');
  const [password, setPassword] = useState('Demo1234');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    try {
      setLoading(true);
      const data = await authApi.login(email.trim(), password);
      setSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      router.replace('/(tabs)');
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string | string[] } } })?.response
          ?.data?.message ?? 'Falha no login';
      Alert.alert('Erro', Array.isArray(msg) ? msg.join('\n') : String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.wrap}>
      <View style={styles.brand}>
        <Text style={styles.logo}>NOX</Text>
        <Text style={styles.logoAccent}>FINANCE</Text>
      </View>
      <Title>Entrar</Title>
      <Subtitle>Seu dinheiro. Sua estratégia. Seu controle.</Subtitle>

      <Label>E-mail</Label>
      <Input
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="seu@email.com"
      />
      <Label>Senha</Label>
      <Input
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
      />

      <Button title="Acessar" onPress={onSubmit} loading={loading} />
      <Link href="/(auth)/register" style={styles.link}>
        Criar conta
      </Link>
      <Link href="/(auth)/forgot" style={styles.linkMuted}>
        Recuperar senha
      </Link>
      <Text style={styles.hint}>
        Conta de demonstração pré-carregada (dados fictícios acadêmicos).
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { justifyContent: 'center' },
  brand: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  logo: { color: colors.text, fontSize: 34, fontWeight: '900', letterSpacing: 2 },
  logoAccent: { color: colors.primary, fontSize: 34, fontWeight: '900', letterSpacing: 2 },
  link: {
    color: colors.primaryBright,
    textAlign: 'center',
    marginTop: 18,
    fontWeight: '700',
  },
  linkMuted: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
  hint: {
    color: colors.textDim,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 28,
    lineHeight: 18,
  },
});
