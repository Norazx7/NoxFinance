import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  accountsApi,
  categoriesApi,
  transactionsApi,
} from '@/src/api/finance';
import {
  Button,
  Input,
  Label,
  Screen,
  Subtitle,
  Title,
} from '@/src/components/ui';
import { colors } from '@/src/theme/colors';
import { parseBRLInput } from '@/src/utils/money';

export default function NewTransactionScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState<string | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();

  const accounts = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.list(),
  });
  const categories = useQuery({
    queryKey: ['categories', type],
    queryFn: () => categoriesApi.list(type),
  });

  const selectedAccount = useMemo(
    () => accountId ?? accounts.data?.[0]?.id,
    [accountId, accounts.data],
  );

  const create = useMutation({
    mutationFn: () =>
      transactionsApi.create({
        type,
        description: description.trim(),
        amountCents: parseBRLInput(amount),
        accountId: selectedAccount,
        categoryId,
        occurredAt: new Date().toISOString(),
      }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['transactions'] }),
        qc.invalidateQueries({ queryKey: ['dashboard'] }),
        qc.invalidateQueries({ queryKey: ['accounts'] }),
        qc.invalidateQueries({ queryKey: ['budgets'] }),
      ]);
      router.back();
    },
    onError: (e: unknown) => {
      const msg =
        (e as { response?: { data?: { message?: string | string[] } } })?.response
          ?.data?.message ?? 'Falha ao salvar';
      Alert.alert('Erro', Array.isArray(msg) ? msg.join('\n') : String(msg));
    },
  });

  return (
    <Screen>
      <Title>Nova movimentação</Title>
      <Subtitle>Valores enviados em centavos para o backend.</Subtitle>

      <View style={styles.row}>
        {(['EXPENSE', 'INCOME'] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => {
              setType(t);
              setCategoryId(undefined);
            }}
            style={[styles.chip, type === t && styles.chipActive]}
          >
            <Text style={[styles.chipText, type === t && styles.chipTextActive]}>
              {t === 'EXPENSE' ? 'Despesa' : 'Receita'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Label>Descrição</Label>
      <Input value={description} onChangeText={setDescription} placeholder="Ex.: Supermercado" />

      <Label>Valor (R$)</Label>
      <Input
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="0,00"
      />

      <Label>Conta</Label>
      <View style={styles.row}>
        {(accounts.data ?? []).map((a: { id: string; name: string }) => (
          <Pressable
            key={a.id}
            onPress={() => setAccountId(a.id)}
            style={[styles.chip, selectedAccount === a.id && styles.chipActive]}
          >
            <Text
              style={[
                styles.chipText,
                selectedAccount === a.id && styles.chipTextActive,
              ]}
            >
              {a.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Label>Categoria</Label>
      <View style={styles.row}>
        {(categories.data ?? []).map((c: { id: string; name: string }) => (
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

      <Button
        title="Salvar"
        onPress={() => create.mutate()}
        loading={create.isPending}
        disabled={!description || !amount || !selectedAccount}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
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
});
