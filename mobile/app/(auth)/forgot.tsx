import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { authApi } from '@/src/api/finance';
import { Button, Input, Label, Screen, Subtitle, Title } from '@/src/components/ui';
import { colors } from '@/src/theme/colors';

export default function ForgotScreen() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function requestToken() {
    try {
      setLoading(true);
      const data = await authApi.forgotPassword(email.trim());
      setResetToken(data.resetToken);
      if (data.resetToken) setToken(data.resetToken);
      Alert.alert('Recuperação', data.message);
    } catch {
      Alert.alert('Erro', 'Não foi possível solicitar recuperação');
    } finally {
      setLoading(false);
    }
  }

  async function reset() {
    try {
      setLoading(true);
      await authApi.resetPassword(token.trim(), newPassword);
      Alert.alert('Sucesso', 'Senha atualizada. Faça login novamente.');
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string | string[] } } })?.response
          ?.data?.message ?? 'Falha ao redefinir senha';
      Alert.alert('Erro', Array.isArray(msg) ? msg.join('\n') : String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.wrap}>
      <Title>Recuperar senha</Title>
      <Subtitle>
        Em produção o token seria enviado por e-mail. No ambiente acadêmico ele pode
        ser exibido na resposta da API.
      </Subtitle>
      <Label>E-mail</Label>
      <Input
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Solicitar token" onPress={requestToken} loading={loading} />
      {resetToken ? (
        <Text style={styles.token}>Token (demo): {resetToken}</Text>
      ) : null}
      <Label>Token</Label>
      <Input value={token} onChangeText={setToken} />
      <Label>Nova senha</Label>
      <Input secureTextEntry value={newPassword} onChangeText={setNewPassword} />
      <Button title="Redefinir senha" onPress={reset} loading={loading} />
      <Link href="/(auth)/login" style={styles.link}>
        Voltar ao login
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
  token: {
    color: colors.primaryBright,
    fontSize: 12,
    marginTop: 12,
  },
});
