import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { aiApi } from '@/src/api/finance';
import {
  Button,
  Card,
  Input,
  Label,
  Screen,
  Subtitle,
  Title,
} from '@/src/components/ui';
import { colors } from '@/src/theme/colors';
import { parseBRLInput } from '@/src/utils/money';

const SUGGESTIONS = [
  'Quanto gastei neste mês?',
  'Qual categoria está consumindo mais dinheiro?',
  'Quanto posso gastar até o final do mês?',
  'Como estão minhas finanças?',
  'Onde posso economizar?',
  'Como minhas despesas mudaram em relação ao mês anterior?',
];

export default function AiScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [facts, setFacts] = useState<Record<string, unknown> | null>(null);
  const [simulateDesc, setSimulateDesc] = useState('Notebook');
  const [simulateValue, setSimulateValue] = useState('2500,00');

  const ask = useMutation({
    mutationFn: (q: string) => aiApi.ask(q),
    onSuccess: (data) => {
      setAnswer(data.answer);
      setFacts(data.factsUsed);
    },
  });

  const simulate = useMutation({
    mutationFn: () =>
      aiApi.simulate(simulateDesc, parseBRLInput(simulateValue)),
    onSuccess: (data) => {
      setAnswer(data.answer);
      setFacts(data.simulation);
    },
  });

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Title>NOX AI</Title>
          <Subtitle>
            Assistente que interpreta apenas dados financeiros autorizados e
            calculados pelo backend.
          </Subtitle>

          <View style={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <Button
                key={s}
                title={s}
                variant="ghost"
                onPress={() => {
                  setQuestion(s);
                  ask.mutate(s);
                }}
              />
            ))}
          </View>

          <Label>Sua pergunta</Label>
          <Input
            value={question}
            onChangeText={setQuestion}
            placeholder="Ex.: Como estão minhas finanças?"
          />
          <Button
            title="Perguntar à NOX AI"
            onPress={() => ask.mutate(question)}
            loading={ask.isPending}
          />

          <Card style={{ marginTop: 18 }}>
            <Text style={styles.section}>Simular compra</Text>
            <Label>Produto</Label>
            <Input value={simulateDesc} onChangeText={setSimulateDesc} />
            <Label>Valor (R$)</Label>
            <Input
              value={simulateValue}
              onChangeText={setSimulateValue}
              keyboardType="decimal-pad"
            />
            <Button
              title="Simular impacto no orçamento"
              onPress={() => simulate.mutate()}
              loading={simulate.isPending}
            />
            <Text style={styles.note}>
              A simulação não altera movimentações. Confirmação do usuário é
              obrigatória para registrar qualquer despesa.
            </Text>
          </Card>

          {answer ? (
            <Card style={{ marginTop: 18, backgroundColor: '#0F1A16' }}>
              <Text style={styles.section}>Resposta</Text>
              <Text style={styles.answer}>{answer}</Text>
              {facts ? (
                <Text style={styles.note}>
                  Fatos usados (backend): {JSON.stringify(facts)}
                </Text>
              ) : null}
            </Card>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  suggestions: { marginTop: 8, gap: 0 },
  section: { color: colors.text, fontWeight: '700', marginBottom: 8 },
  answer: { color: colors.text, lineHeight: 22, fontSize: 15 },
  note: { color: colors.textDim, fontSize: 12, marginTop: 12, lineHeight: 18 },
});
