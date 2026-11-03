import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { authApi } from '@/src/api/finance';
import { Button, Input, Label, Screen, Subtitle, Title } from '@/src/components/ui';
import { useAuthStore } from '@/src/store/auth';
import { colors } from '@/src/theme/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    try {
      setLoading(true);
      const data = await authApi.register(name.trim(), email.trim(), password);
      setSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      router.replace('/(tabs)');
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string | string[] } } })?.response
          ?.data?.message ?? 'Falha no cadastro';
      Alert.alert('Erro', Array.isArray(msg) ? msg.join('\n') : String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.wrap}>
      <Title>Criar conta</Title>
      <Subtitle>Cadastro seguro com isolamento dos seus dados financeiros.</Subtitle>
      <Label>Nome</Label>
      <Input value={name} onChangeText={setName} placeholder="Seu nome" />
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
        placeholder="Mín. 8 caracteres, letras e números"
      />
      <Button title="Cadastrar" onPress={onSubmit} loading={loading} />
      <Link href="/(auth)/login" style={styles.link}>
        Já tenho conta
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { justifyContent: 'center' },
  link: {
    color: colors.primaryBright,
    textAlign: 'center',
    marginTop: 18,
    fontWeight: '700',
  },
});
