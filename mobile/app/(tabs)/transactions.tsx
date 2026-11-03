import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { categoriesApi, transactionsApi } from '@/src/api/finance';
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  Money,
  Screen,
  Subtitle,
  Title,
} from '@/src/components/ui';
import { colors } from '@/src/theme/colors';

export default function TransactionsScreen() {
  const router = useRouter();
  const [type, setType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [categoryId, setCategoryId] = useState<string | undefined>();

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  });

  const list = useQuery({
    queryKey: ['transactions', type, categoryId],
    queryFn: () =>
      transactionsApi.list({
        type: type === 'ALL' ? undefined : type,
        categoryId,
      }),
  });

  const filters = useMemo(
    () => [
      { id: 'ALL', label: 'Todas' },
      { id: 'INCOME', label: 'Receitas' },
      { id: 'EXPENSE', label: 'Despesas' },
    ],
    [],
  );

  return (
    <Screen>
      <Title>Movimentações</Title>
      <Subtitle>Histórico completo com filtros por tipo e categoria.</Subtitle>

      <View style={styles.filters}>
        {filters.map((f) => (
          <Pressable
            key={f.id}
            onPress={() => setType(f.id as typeof type)}
            style={[styles.chip, type === f.id && styles.chipActive]}
          >
            <Text style={[styles.chipText, type === f.id && styles.chipTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.filters}>
        <Pressable
          onPress={() => setCategoryId(undefined)}
          style={[styles.chip, !categoryId && styles.chipActive]}
        >
          <Text style={[styles.chipText, !categoryId && styles.chipTextActive]}>
            Todas categorias
          </Text>
        </Pressable>
        {(categories.data ?? []).slice(0, 6).map((c: { id: string; name: string }) => (
          <Pressable
            key={c.id}
            onPress={() => setCategoryId(c.id)}
            style={[styles.chip, categoryId === c.id && styles.chipActive]}
          >
            <Text
              style={[
                styles.chipText,
                categoryId === c.id && styles.chipTextActive,
              ]}
            >
              {c.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Button title="Nova movimentação" onPress={() => router.push('/transaction/new')} />

      {list.isLoading ? <LoadingState /> : null}
      {list.isError ? (
        <ErrorState message="Erro ao carregar" onRetry={() => list.refetch()} />
      ) : null}
      {list.data && list.data.length === 0 ? (
        <EmptyState
          title="Nenhuma movimentação"
          subtitle="Cadastre receitas e despesas para começar."
        />
      ) : null}

      <FlatList
        data={list.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 12 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.description}</Text>
              <Text style={styles.meta}>
                {item.category?.name ?? 'Sem categoria'} ·{' '}
                {new Date(item.occurredAt).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <Money
              cents={item.amountCents}
              tone={item.type === 'INCOME' ? 'income' : 'expense'}
            />
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  chipText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: colors.primaryBright },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: { color: colors.text, fontWeight: '600' },
  meta: { color: colors.textDim, fontSize: 12, marginTop: 2 },
});
