import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@constants/index';
import { Card, StatusBadge } from './index';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from '@hooks/useTranslation';

export type InterviewType = 'technical' | 'hr' | 'video' | 'onsite';

interface InterviewCardProps {
  candidateName: string;
  jobTitle: string;
  time: string;
  duration: string;
  type: InterviewType;
  status: 'interviewing' | 'review' | 'screening' | 'hired' | 'rejected';
  interviewers: string[];
  onJoin?: () => void;
  onReschedule?: () => void;
}

const TYPE_CONFIG = {
  technical: { icon: 'code-braces', color: Colors.accent.purple, labelKey: 'calendar.interviewTypes.technical' },
  hr: { icon: 'account-group', color: Colors.accent.orange, labelKey: 'calendar.interviewTypes.hr' },
  video: { icon: 'video', color: Colors.accent.blue, labelKey: 'calendar.interviewTypes.video' },
  onsite: { icon: 'office-building', color: Colors.accent.green, labelKey: 'calendar.interviewTypes.onsite' },
};

/**
 * Tarjeta de entrevista profesional con diseño premium
 */
export const InterviewCard: React.FC<InterviewCardProps> = ({
  candidateName,
  jobTitle,
  time,
  duration,
  type,
  status,
  interviewers,
  onJoin,
  onReschedule,
}) => {
  const { t } = useTranslation();
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.video;

  return (
    <Card style={styles.card} elevated>
      <View style={styles.header}>
        <View style={styles.timeContainer}>
          <MaterialCommunityIcons name={config.icon as any} size={20} color={config.color} />
          <Text style={[styles.timeText, { color: config.color }]}>{time}</Text>
          <Text style={styles.durationText}>• {duration}</Text>
        </View>
        <StatusBadge 
          label={t(`applicants.status.${status}`).toUpperCase()} 
          variant={status === 'interviewing' ? 'interviewing' : status} 
        />
      </View>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: Colors.primary[100] }]}>
            <Text style={styles.avatarText}>
              {candidateName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.info}>
          <Text style={styles.candidateName}>{candidateName}</Text>
          <Text style={styles.jobTitle}>{jobTitle}</Text>
          <View style={styles.interviewersContainer}>
            <Ionicons name="people-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.interviewersText}>
              {interviewers.join(', ')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.rescheduleButton]} 
          onPress={onReschedule}
        >
          <Text style={styles.rescheduleTitle}>{t('calendar.actions.reschedule')}</Text>
        </TouchableOpacity>
        
        {type === 'video' && (
          <TouchableOpacity 
            style={[styles.button, styles.joinButton]} 
            onPress={onJoin}
          >
            <Ionicons name="videocam" size={16} color={Colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.joinTitle}>{t('calendar.actions.join')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing[4],
    padding: Spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    marginLeft: Spacing[2],
  },
  durationText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginLeft: Spacing[1],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  avatarContainer: {
    marginRight: Spacing[3],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  info: {
    flex: 1,
  },
  candidateName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  jobTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  interviewersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[2],
  },
  interviewersText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing[4],
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescheduleButton: {
    backgroundColor: Colors.gray[100],
  },
  rescheduleTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray[700],
  },
  joinButton: {
    backgroundColor: Colors.primary[700],
  },
  joinTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.white,
  },
});
