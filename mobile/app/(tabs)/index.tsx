import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { dashboardApi, reportsApi } from '@/src/api/finance';
import { MiniBarChart } from '@/src/components/MiniBarChart';
import {
  Button,
  Card,
  ErrorState,
  LoadingState,
  Money,
  Screen,
  Subtitle,
  Title,
} from '@/src/components/ui';
import { colors } from '@/src/theme/colors';
import { formatBRL } from '@/src/utils/money';

export default function DashboardScreen() {
  const router = useRouter();
  const dashboard = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.get(),
  });
  const evolution = useQuery({
    queryKey: ['evolution'],
    queryFn: () => reportsApi.evolution(),
  });

  if (dashboard.isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (dashboard.isError || !dashboard.data) {
    return (
      <Screen>
        <ErrorState
          message="Não foi possível carregar o dashboard"
          onRetry={() => dashboard.refetch()}
        />
      </Screen>
    );
  }

  const d = dashboard.data;

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={dashboard.isFetching}
            onRefresh={() => {
              dashboard.refetch();
              evolution.refetch();
            }}
            tintColor={colors.primary}
          />
        }
      >
        <Text style={styles.brand}>NOX FINANCE</Text>
        <Title>Visão geral</Title>
        <Subtitle>Resumo do mês com comparação ao período anterior.</Subtitle>

        <Card style={styles.hero}>
          <Text style={styles.heroLabel}>Saldo total</Text>
          <Money cents={d.totalBalanceCents} style={styles.heroValue} />
          <View style={styles.row}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Receitas</Text>
              <Money cents={d.incomeCents} tone="income" />
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Despesas</Text>
              <Money cents={d.expenseCents} tone="expense" />
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.section}>Comparação com o mês anterior</Text>
          <Text style={styles.compare}>
            Receitas: {formatBRL(d.comparison.incomeDeltaCents)} · Despesas:{' '}
            {formatBRL(d.comparison.expenseDeltaCents)}
          </Text>
        </Card>

        <Card>
          <Text style={styles.section}>Evolução financeira</Text>
          {evolution.data ? (
            <MiniBarChart
              data={evolution.data.series.map(
                (s: {
                  label: string;
                  incomeCents: number;
                  expenseCents: number;
                }) => ({
                  label: s.label.slice(0, 5),
                  incomeCents: s.incomeCents,
                  expenseCents: s.expenseCents,
                }),
              )}
            />
          ) : (
            <Text style={styles.compare}>Carregando gráfico...</Text>
          )}
        </Card>

        <Card>
          <Text style={styles.section}>Últimas transações</Text>
          {d.recentTransactions.length === 0 ? (
            <Text style={styles.compare}>Nenhuma movimentação ainda.</Text>
          ) : (
            d.recentTransactions.map(
              (t: {
                id: string;
                description: string;
                amountCents: number;
                type: string;
                category?: { name?: string };
              }) => (
                <View key={t.id} style={styles.tx}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.txTitle}>{t.description}</Text>
                    <Text style={styles.txMeta}>
                      {t.category?.name ?? 'Sem categoria'}
                    </Text>
                  </View>
                  <Money
                    cents={t.amountCents}
                    tone={t.type === 'INCOME' ? 'income' : 'expense'}
                  />
                </View>
              ),
            )
          )}
        </Card>

        <Button
          title="Nova movimentação"
          onPress={() => router.push('/transaction/new')}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 14 },
  brand: {
    color: colors.primary,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  hero: {
    backgroundColor: '#0F1A16',
    borderColor: colors.primarySoft,
  },
  heroLabel: { color: colors.textMuted, marginBottom: 4 },
  heroValue: { fontSize: 32, marginBottom: 16 },
  row: { flexDirection: 'row', gap: 12 },
  metric: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: 12,
    padding: 12,
  },
  metricLabel: { color: colors.textDim, marginBottom: 4, fontSize: 12 },
  section: { color: colors.text, fontWeight: '700', marginBottom: 8 },
  compare: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
  tx: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  txTitle: { color: colors.text, fontWeight: '600' },
  txMeta: { color: colors.textDim, fontSize: 12, marginTop: 2 },
});
