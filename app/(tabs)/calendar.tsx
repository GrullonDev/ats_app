import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '@utils/responsive';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';
import { Avatar, Card } from '@components/ui';
import { MOCK_INTERVIEWS } from '@utils/mockData';

export default function CalendarTab() {
  const { t } = useTranslation();
  const [viewType, setViewType] = useState<'day' | 'week'>('day');
  const [selectedDay, setSelectedDay] = useState(22);

  const days = [
    { name: 'SUN', date: 1 }, { name: 'MON', date: 2 }, { name: 'TUE', date: 3 }, { name: 'WED', date: 4 }, { name: 'THU', date: 5 }, { name: 'FRI', date: 6 }, { name: 'SAT', date: 7 },
    { name: 'SUN', date: 8 }, { name: 'MON', date: 9 }, { name: 'TUE', date: 10 }, { name: 'WED', date: 11 }, { name: 'THU', date: 12 }, { name: 'FRI', date: 13 }, { name: 'SAT', date: 14 },
    { name: 'SUN', date: 15 }, { name: 'MON', date: 16 }, { name: 'TUE', date: 17 }, { name: 'WED', date: 18 }, { name: 'THU', date: 19 }, { name: 'FRI', date: 20 }, { name: 'SAT', date: 21 },
    { name: 'SUN', date: 22, hasEvent: true }, { name: 'MON', date: 23, hasEvent: true }, { name: 'TUE', date: 24, hasEvent: true }, { name: 'WED', date: 25, hasEvent: true }, { name: 'THU', date: 26 }, { name: 'FRI', date: 27 }, { name: 'SAT', date: 28 },
  ];

  const renderInterview = ({ item }: { item: any }) => (
    <Card style={styles.interviewCard}>
      <View style={styles.timeHeader}>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{item.time}</Text>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>
        <View style={[styles.statusDot, { backgroundColor: Colors.accent.green }]} />
      </View>

      <View style={styles.candidateRow}>
        <Avatar name={item.applicantName} size={40} />
        <View style={styles.candidateInfo}>
          <Text style={styles.candidateName}>{item.applicantName}</Text>
          <Text style={styles.jobTitle}>{item.jobTitle}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsList}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{item.type}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="videocam-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{item.modality}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{item.interviewers.join(', ')}</Text>
        </View>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.joinBtn}>
          <Text style={styles.joinBtnText}>{t('calendar.joinCall')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rescheduleBtn}>
          <Text style={styles.rescheduleBtnText}>{t('calendar.reschedule')}</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('calendar.title')}</Text>
          <Text style={styles.headerSubtitle}>Febrero 2026</Text>
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewType === 'day' && styles.toggleBtnActive]}
            onPress={() => setViewType('day')}
          >
            <Text style={[styles.toggleText, viewType === 'day' && styles.toggleTextActive]}>
              {t('calendar.day')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewType === 'week' && styles.toggleBtnActive]}
            onPress={() => setViewType('week')}
          >
            <Text style={[styles.toggleText, viewType === 'week' && styles.toggleTextActive]}>
              {t('calendar.week')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <View style={styles.weekDaysHeader}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
            <Text key={d} style={styles.weekDayText}>{d}</Text>
          ))}
        </View>
        <View style={styles.calendarGrid}>
          {days.map((day, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.dayCell,
                selectedDay === day.date && styles.dayCellSelected,
              ]}
              onPress={() => setSelectedDay(day.date)}
            >
              <Text style={[
                styles.dayText,
                selectedDay === day.date && styles.dayTextSelected,
              ]}>
                {day.date}
              </Text>
              {day.hasEvent && (
                <View style={[
                  styles.eventDot,
                  selectedDay === day.date && styles.eventDotSelected,
                ]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.scheduleHeader}>
        <Text style={styles.scheduleTitle}>{t('calendar.todaySchedule')}</Text>
        <TouchableOpacity>
          <Text style={styles.interviewsCount}>
            {t('calendar.interviewsCount', { count: 2 })}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_INTERVIEWS}
        keyExtractor={(item) => item.id}
        renderItem={renderInterview}
        contentContainerStyle={styles.interviewsList}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing[4],
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.gray[100],
    padding: 2,
    borderRadius: BorderRadius.md,
  },
  toggleBtn: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.sm,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary[800],
  },
  toggleText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  calendarContainer: {
    backgroundColor: Colors.white,
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    marginBottom: Spacing[4],
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textDisabled,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing[2],
  },
  dayCell: {
    width: '14.28%',
    height: verticalScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  dayCellSelected: {
    backgroundColor: Colors.primary[800],
  },
  dayText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  dayTextSelected: {
    color: Colors.white,
  },
  eventDot: {
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
    backgroundColor: Colors.primary[500],
    marginTop: moderateScale(4),
  },
  eventDotSelected: {
    backgroundColor: Colors.white,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing[4],
    marginTop: Spacing[2],
  },
  scheduleTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  interviewsCount: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[800],
  },
  interviewsList: {
    paddingHorizontal: Spacing[4],
    paddingBottom: 100,
  },
  interviewCard: {
    backgroundColor: Colors.white,
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[800],
    marginRight: Spacing[2],
  },
  durationBadge: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  durationText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.bold,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  candidateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  candidateInfo: {
    marginLeft: Spacing[3],
  },
  candidateName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  jobTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[100],
    marginBottom: Spacing[4],
  },
  detailsList: {
    marginBottom: Spacing[4],
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  detailText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing[2],
  },
  btnRow: {
    flexDirection: 'row',
  },
  joinBtn: {
    backgroundColor: Colors.primary[800],
    flex: 2,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[2],
  },
  joinBtnText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  rescheduleBtn: {
    backgroundColor: Colors.gray[100],
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescheduleBtnText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  fab: {
    position: 'absolute',
    bottom: verticalScale(20),
    right: scale(20),
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: Colors.primary[800],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
});
