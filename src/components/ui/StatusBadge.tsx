import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, BorderRadius, Shadows, Typography } from '@constants/index';

type BadgeVariant = 
  | 'active' 
  | 'interviewing' 
  | 'new' 
  | 'closed' 
  | 'paused' 
  | 'draft' 
  | 'hired' 
  | 'rejected'
  | 'screening'
  | 'application_review'
  | 'phone_screening'
  | 'first_interview'
  | 'second_interview'
  | 'technical_test'
  | 'offer_sent'
  | 'onboarding';

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
}

const BADGE_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  active: { bg: Colors.accent.blueLight, text: Colors.accent.blue },
  interviewing: { bg: Colors.accent.orangeLight, text: Colors.accent.orange },
  new: { bg: Colors.accent.greenLight, text: Colors.accent.green },
  closed: { bg: Colors.gray[200], text: Colors.gray[600] },
  paused: { bg: Colors.accent.purpleLight, text: Colors.accent.purple },
  draft: { bg: Colors.gray[100], text: Colors.gray[500] },
  hired: { bg: Colors.accent.greenLight, text: Colors.accent.green },
  rejected: { bg: Colors.accent.redLight, text: Colors.accent.red },
  screening: { bg: Colors.accent.purpleLight, text: Colors.accent.purple },
  application_review: { bg: Colors.gray[200], text: Colors.gray[600] },
  phone_screening: { bg: Colors.accent.purpleLight, text: Colors.accent.purple },
  first_interview: { bg: Colors.accent.blueLight, text: Colors.accent.blue },
  second_interview: { bg: Colors.accent.blueLight, text: Colors.accent.blue },
  technical_test: { bg: Colors.accent.orangeLight, text: Colors.accent.orange },
  offer_sent: { bg: Colors.accent.greenLight, text: Colors.accent.green },
  onboarding: { bg: Colors.accent.greenLight, text: Colors.accent.green },
};

/**
 * Badge de estado — muestra el estado de una vacante o aplicante
 */
export const StatusBadge: React.FC<BadgeProps> = ({
  label,
  variant,
  style,
  textStyle,
  onPress,
}) => {
  const colors = BADGE_STYLES[variant] ?? BADGE_STYLES.active;

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.badge, { backgroundColor: colors.bg }, style]}
      onPress={onPress}
    >
      <Text style={[styles.badgeText, { color: colors.text }, textStyle]}>
        {label}
      </Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
});
