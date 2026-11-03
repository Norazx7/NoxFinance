import { useQuery } from '@tanstack/react-query';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  accountsApi,
  budgetsApi,
  cardsApi,
  goalsApi,
  recurringApi,
} from '@/src/api/finance';
import {
  Card,
  ErrorState,
  LoadingState,
  Money,
  ProgressBar,
  Screen,
  Subtitle,
  Title,
} from '@/src/components/ui';
import { colors } from '@/src/theme/colors';
import { formatBRL } from '@/src/utils/money';

export default function PlanningScreen() {
  const budgets = useQuery({ queryKey: ['budgets'], queryFn: () => budgetsApi.list() });
  const goals = useQuery({ queryKey: ['goals'], queryFn: () => goalsApi.list() });
  const recurring = useQuery({
    queryKey: ['recurring'],
    queryFn: () => recurringApi.list(),
  });
  const forecast = useQuery({
    queryKey: ['forecast'],
    queryFn: () => recurringApi.forecast(),
  });
  const accounts = useQuery({ queryKey: ['accounts'], queryFn: () => accountsApi.list() });
  const cards = useQuery({ queryKey: ['cards'], queryFn: () => cardsApi.list() });

  const loading =
    budgets.isLoading ||
    goals.isLoading ||
    recurring.isLoading ||
    accounts.isLoading;

  if (loading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (budgets.isError) {
    return (
      <Screen>
        <ErrorState message="Erro ao carregar planejamento" onRetry={() => budgets.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={budgets.isFetching}
            onRefresh={() => {
              budgets.refetch();
              goals.refetch();
              recurring.refetch();
              forecast.refetch();
              accounts.refetch();
              cards.refetch();
            }}
            tintColor={colors.primary}
          />
        }
      >
        <Title>Planejamento</Title>
        <Subtitle>Orçamentos, metas, contas, cartões e previsão de fluxo.</Subtitle>

        <Card>
          <Text style={styles.section}>Contas</Text>
          {(accounts.data ?? []).map(
            (a: { id: string; name: string; balanceCents: number }) => (
              <View key={a.id} style={styles.row}>
                <Text style={styles.item}>{a.name}</Text>
                <Money cents={a.balanceCents} />
              </View>
            ),
          )}
        </Card>

        <Card>
          <Text style={styles.section}>Cartões</Text>
          {(cards.data ?? []).map(
            (c: {
              id: string;
              name: string;
              limitCents: number;
              usedCents: number;
              lastFourDigits?: string;
            }) => (
              <View key={c.id} style={{ marginBottom: 12 }}>
                <View style={styles.row}>
                  <Text style={styles.item}>
                    {c.name}
                    {c.lastFourDigits ? ` •• ${c.lastFourDigits}` : ''}
                  </Text>
                  <Text style={styles.meta}>
                    {formatBRL(c.usedCents)} / {formatBRL(c.limitCents)}
                  </Text>
                </View>
                <ProgressBar
                  percent={
                    c.limitCents === 0
                      ? 0
                      : Math.round((c.usedCents / c.limitCents) * 100)
                  }
                  color={colors.warning}
                />
              </View>
            ),
          )}
        </Card>

        <Card>
          <Text style={styles.section}>Orçamentos</Text>
          {(budgets.data ?? []).length === 0 ? (
            <Text style={styles.meta}>Nenhum orçamento cadastrado.</Text>
          ) : (
            (budgets.data ?? []).map(
              (b: {
                id: string;
                name: string;
                spentCents: number;
                limitCents: number;
                progressPercent: number;
                remainingCents: number;
              }) => (
                <View key={b.id} style={{ marginBottom: 14 }}>
                  <View style={styles.row}>
                    <Text style={styles.item}>{b.name}</Text>
                    <Text style={styles.meta}>{b.progressPercent}%</Text>
                  </View>
                  <ProgressBar percent={b.progressPercent} />
                  <Text style={styles.meta}>
                    Gasto {formatBRL(b.spentCents)} · Restante{' '}
                    {formatBRL(b.remainingCents)}
                  </Text>
                </View>
              ),
            )
          )}
        </Card>

        <Card>
          <Text style={styles.section}>Metas</Text>
          {(goals.data ?? []).map(
            (g: {
              id: string;
              name: string;
              currentCents: number;
              targetCents: number;
              progressPercent: number;
            }) => (
              <View key={g.id} style={{ marginBottom: 14 }}>
                <View style={styles.row}>
                  <Text style={styles.item}>{g.name}</Text>
                  <Text style={styles.meta}>{g.progressPercent}%</Text>
                </View>
                <ProgressBar percent={g.progressPercent} />
                <Text style={styles.meta}>
                  {formatBRL(g.currentCents)} de {formatBRL(g.targetCents)}
                </Text>
              </View>
            ),
          )}
        </Card>

        <Card>
          <Text style={styles.section}>Despesas recorrentes</Text>
          {(recurring.data ?? []).map(
            (r: { id: string; name: string; amountCents: number; nextDueDate: string }) => (
              <View key={r.id} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.item}>{r.name}</Text>
                  <Text style={styles.meta}>
                    Próximo: {new Date(r.nextDueDate).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <Money cents={r.amountCents} tone="expense" />
              </View>
            ),
          )}
        </Card>

        {forecast.data ? (
          <Card>
            <Text style={styles.section}>Previsão de fluxo (30 dias)</Text>
            <Text style={styles.meta}>
              Saldo inicial: {formatBRL(forecast.data.startingBalanceCents)}
            </Text>
            <Text style={styles.meta}>
              Despesas projetadas:{' '}
              {formatBRL(forecast.data.totalProjectedExpenseCents)}
            </Text>
            <Text style={[styles.item, { marginTop: 8 }]}>
              Saldo projetado:{' '}
              {formatBRL(forecast.data.projectedEndingBalanceCents)}
            </Text>
          </Card>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 14 },
  section: { color: colors.text, fontWeight: '700', marginBottom: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  item: { color: colors.text, fontWeight: '600' },
  meta: { color: colors.textMuted, fontSize: 12 },
});
