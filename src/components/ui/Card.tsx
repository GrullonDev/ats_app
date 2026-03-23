import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '@constants/index';
import { moderateScale } from '@utils/responsive';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevated?: boolean;
}

/**
 * Card contenedor con sombra suave y bordes redondeados.
 * Se usa en todo el dashboard para secciones y listas.
 */
export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevated = false,
}) => {
  const Container = onPress ? TouchableOpacity : View;
  const shadowStyle = elevated ? Shadows.lg : Shadows.md;

  return (
    <Container
      style={[styles.card, shadowStyle, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
  },
});
