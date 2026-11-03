import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '@/src/theme/colors';

export function Screen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function Input(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      placeholderTextColor={colors.textDim}
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        isPrimary && styles.buttonPrimary,
        variant === 'ghost' && styles.buttonGhost,
        isDanger && styles.buttonDanger,
        (disabled || loading) && { opacity: 0.55 },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === 'ghost' && { color: colors.primaryBright },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export function Money({
  cents,
  tone = 'neutral',
  style,
}: {
  cents: number;
  tone?: 'neutral' | 'income' | 'expense';
  style?: TextStyle;
}) {
  const color =
    tone === 'income'
      ? colors.income
      : tone === 'expense'
        ? colors.expense
        : colors.text;
  return (
    <Text style={[{ color, fontWeight: '700', fontVariant: ['tabular-nums'] }, style]}>
      {(cents / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}
    </Text>
  );
}

export function EmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.empty}>
      <Text style={[styles.emptyTitle, { color: colors.danger }]}>{message}</Text>
      {onRetry ? <Button title="Tentar novamente" onPress={onRetry} /> : null}
    </View>
  );
}

export function LoadingState() {
  return (
    <View style={styles.empty}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.emptySubtitle}>Carregando...</Text>
    </View>
  );
}

export function ProgressBar({ percent, color = colors.primary }: { percent: number; color?: string }) {
  const width = Math.max(0, Math.min(100, percent));
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${width}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.bgElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: colors.black,
    fontWeight: '800',
    fontSize: 15,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.bgElevated,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
});
