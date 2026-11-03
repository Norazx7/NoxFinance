import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme/colors';

type Point = {
  label: string;
  incomeCents: number;
  expenseCents: number;
};

export function MiniBarChart({ data }: { data: Point[] }) {
  const max = Math.max(
    1,
    ...data.flatMap((d) => [d.incomeCents, d.expenseCents]),
  );

  return (
    <View style={styles.wrap}>
      {data.map((d) => (
        <View key={d.label} style={styles.col}>
          <View style={styles.bars}>
            <View
              style={[
                styles.bar,
                {
                  height: Math.max(4, (d.incomeCents / max) * 72),
                  backgroundColor: colors.income,
                },
              ]}
            />
            <View
              style={[
                styles.bar,
                {
                  height: Math.max(4, (d.expenseCents / max) * 72),
                  backgroundColor: colors.expense,
                },
              ]}
            />
          </View>
          <Text style={styles.label}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    minHeight: 100,
    paddingTop: 8,
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 80,
  },
  bar: {
    width: 8,
    borderRadius: 4,
  },
  label: {
    color: colors.textDim,
    fontSize: 10,
    marginTop: 6,
  },
});
