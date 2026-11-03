import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { authApi, reportsApi } from '@/src/api/finance';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  Screen,
  Subtitle,
  Title,
} from '@/src/components/ui';
import { useAuthStore } from '@/src/store/auth';
import { colors } from '@/src/theme/colors';
import { formatBRL } from '@/src/utils/money';
import { API_URL } from '@/src/api/client';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const logout = useAuthStore((s) => s.logout);

  const byCategory = useQuery({
    queryKey: ['report-category'],
    queryFn: () => reportsApi.byCategory(),
  });

  async function onLogout() {
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // ignore network errors on logout
    }
    logout();
    router.replace('/(auth)/login');
  }

  return (
    <Screen>
      <Title>Perfil</Title>
      <Subtitle>Conta autenticada com isolamento de dados por usuário.</Subtitle>

      <Card style={{ marginTop: 16 }}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{user?.name}</Text>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={styles.label}>API</Text>
        <Text style={styles.meta}>{API_URL}</Text>
      </Card>

      <Card style={{ marginTop: 14 }}>
        <Text style={styles.section}>Relatório — despesas por categoria</Text>
        {(byCategory.data?.items ?? []).map(
          (i: {
            categoryId: string | null;
            name: string;
            totalCents: number;
            percent: number;
          }) => (
            <View key={i.categoryId ?? i.name} style={styles.row}>
              <Text style={styles.value}>
                {i.name} ({i.percent}%)
              </Text>
              <Text style={styles.meta}>{formatBRL(i.totalCents)}</Text>
            </View>
          ),
        )}
      </Card>

      <Card style={{ marginTop: 14 }}>
        <Text style={styles.section}>Segurança</Text>
        <Text style={styles.meta}>
          JWT + refresh token, senhas com bcrypt, validação de entrada e dados
          isolados por userId em todas as consultas.
        </Text>
      </Card>

      <Button title="Sair" variant="danger" onPress={onLogout} />
      <Button
        title="Sobre o projeto acadêmico"
        variant="ghost"
        onPress={() =>
          Alert.alert(
            'NOX FINANCE',
            'Projeto acadêmico — Witorio Bandeira Couto — Estácio de Sá (Goiânia) — ADS — Programação Para Dispositivos Móveis em Android — 2026.2',
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textDim, fontSize: 12, marginTop: 8 },
  value: { color: colors.text, fontWeight: '700', marginTop: 2 },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 4, lineHeight: 18 },
  section: { color: colors.text, fontWeight: '700', marginBottom: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
});
