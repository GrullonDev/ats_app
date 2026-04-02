import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';

interface CalendarHeaderProps {
  title: string;
  viewMode: 'day' | 'week' | 'month';
  onViewModeChange: (mode: 'day' | 'week' | 'month') => void;
  onAddEvent?: () => void;
}

/**
 * Encabezado personalizado para el calendario con selectores de vista
 */
export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  title,
  viewMode,
  onViewModeChange,
  onAddEvent,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddEvent}>
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.selectorContainer}>
        <View style={styles.segmentedControl}>
          <TouchableOpacity 
            style={[
              styles.segment, 
              viewMode === 'day' && styles.activeSegment
            ]}
            onPress={() => onViewModeChange('day')}
          >
            <Text style={[
              styles.segmentText, 
              viewMode === 'day' && styles.activeSegmentText
            ]}>{t('calendar.viewDay')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.segment, 
              viewMode === 'week' && styles.activeSegment
            ]}
            onPress={() => onViewModeChange('week')}
          >
            <Text style={[
              styles.segmentText, 
              viewMode === 'week' && styles.activeSegmentText
            ]}>{t('calendar.viewWeek')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.segment, 
              viewMode === 'month' && styles.activeSegment
            ]}
            onPress={() => onViewModeChange('month')}
          >
            <Text style={[
              styles.segmentText, 
              viewMode === 'month' && styles.activeSegmentText
            ]}>{t('calendar.viewMonth')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    backgroundColor: Colors.background,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorContainer: {
    marginBottom: Spacing[4],
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.lg,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  activeSegment: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
  activeSegmentText: {
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.bold,
  },
});
