import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { scale, verticalScale, moderateScale } from '@utils/responsive';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';
import { Avatar, Card } from '@components/ui';
import { MOCK_INTERVIEWS } from '@utils/mockData';

// Extended Interview Type with Status
interface Interview {
  id: string;
  applicantId: string;
  applicantName: string;
  jobTitle: string;
  time: string;
  duration: string;
  type: string;
  modality: string;
  interviewers: string[];
  status: 'confirmed' | 'pending' | 'rescheduled' | 'completed' | 'cancelled' | 'live';
  isNext?: boolean;
}

/**
 * Pantalla de Calendario de Entrevistas - Versión Operativa
 */
export default function CalendarTab() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [viewType, setViewType] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [filterType, setFilterType] = useState<'all' | 'technical' | 'hr'>('all');

  // Native Date Helpers
  const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };
  const endOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() + (6 - day);
    return new Date(d.setDate(diff));
  };
  const isSameDay = (d1: Date, d2: Date) => 
    d1.getDate() === d2.getDate() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getFullYear() === d2.getFullYear();

  const eachDayOfInterval = (start: Date, end: Date) => {
    const days = [];
    let current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  // Days in current view (Month or Week)
  const daysInView = useMemo(() => {
    if (viewType === 'month') {
      const start = startOfMonth(currentMonthDate);
      const end = endOfMonth(currentMonthDate);
      const calendarStart = startOfWeek(start);
      const calendarEnd = endOfWeek(end);
      
      return eachDayOfInterval(calendarStart, calendarEnd).map(date => ({
        date,
        isCurrentMonth: date.getMonth() === currentMonthDate.getMonth(),
        load: Math.floor(Math.random() * 4), 
      }));
    } else {
      const start = startOfWeek(selectedDate);
      const end = endOfWeek(selectedDate);
      return eachDayOfInterval(start, end).map(date => ({
        date,
        isCurrentMonth: true,
        load: Math.floor(Math.random() * 4),
      }));
    }
  }, [viewType, currentMonthDate, selectedDate]);

  // Enrich mock data with status
  const interviews: Interview[] = useMemo(() => [
    {
      ...MOCK_INTERVIEWS[0],
      status: 'live',
      isNext: true,
    },
    {
      ...MOCK_INTERVIEWS[1],
      status: 'confirmed',
    },
    {
      id: 'i3',
      applicantId: 'a4',
      applicantName: 'Elena Rojas',
      jobTitle: 'Senior UI/UX Designer',
      time: '4:30 PM',
      duration: '45 min',
      type: 'Portfolio Review',
      modality: 'Video Call',
      interviewers: ['Mike Chen'],
      status: 'pending',
    }
  ], []);

  const getStatusColor = (status: Interview['status']) => {
    switch (status) {
      case 'confirmed': return Colors.accent.green;
      case 'pending': return Colors.accent.orange;
      case 'rescheduled': return Colors.primary[500];
      case 'completed': return Colors.gray[400];
      case 'cancelled': return Colors.accent.red;
      case 'live': return Colors.primary[600];
      default: return Colors.gray[300];
    }
  };

  const getStatusLabel = (status: Interview['status']) => {
    switch (status) {
      case 'confirmed': return t('calendar.confirmed');
      case 'pending': return t('calendar.pending');
      case 'rescheduled': return t('calendar.rescheduled');
      case 'completed': return t('calendar.completed');
      case 'cancelled': return t('calendar.cancelled');
      case 'live': return t('calendar.liveNow');
      default: return '';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonthDate(prev => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
      return d;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonthDate(today);
  };

  const filteredInterviews = interviews.filter(it => {
    if (filterType === 'all') return true;
    if (filterType === 'technical') return it.type.toLowerCase().includes('technical');
    if (filterType === 'hr') return !it.type.toLowerCase().includes('technical');
    return true;
  });

  const renderInterview = ({ item }: { item: Interview }) => (
    <Card style={[styles.interviewCard, item.isNext ? styles.nextInterviewCard : null] as any}>
      {item.isNext && (
        <View style={styles.nextTag}>
          <Text style={styles.nextTagText}>{t('calendar.upcomingInterview').toUpperCase()}</Text>
        </View>
      )}
      
      <View style={styles.cardHeader}>
        <View style={styles.timeInfo}>
          <Text style={styles.timeText}>{item.time}</Text>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <View style={[styles.statusDotSmall, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusLabel, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.candidateRow} 
        activeOpacity={0.7}
        onPress={() => router.push(`/applicants/${item.applicantId}`)}
      >
        <Avatar name={item.applicantName} size={48} />
        <View style={styles.candidateInfo}>
          <Text style={styles.candidateName}>{item.applicantName}</Text>
          <Text style={styles.jobTitle}>{item.jobTitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.gray[300]} style={styles.chevron} />
      </TouchableOpacity>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="briefcase-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>{item.type}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="videocam-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>{item.modality}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText} numberOfLines={1}>{item.interviewers.join(', ')}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.actionBtnMain}
          onPress={() => Alert.alert(t('calendar.joinCall'), `Joining interview with ${item.applicantName}`)}
        >
          <Ionicons name="videocam" size={18} color={Colors.white} />
          <Text style={styles.actionBtnTextMain}>{t('calendar.joinCall')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionBtnSecondary}
          onPress={() => Alert.alert(t('calendar.reschedule'), `Rescheduling for ${item.applicantName}`)}
        >
          <Text style={styles.actionBtnTextSecondary}>{t('calendar.reschedule')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionBtnIcon}
          onPress={() => Alert.alert('Action Menu', 'Options: Cancel Interview, Add Note, Shared Feedback')}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="calendar-outline" size={60} color={Colors.gray[200]} />
      </View>
      <Text style={styles.emptyTitle}>{t('calendar.noInterviews')}</Text>
      <Text style={styles.emptySubtitle}>{t('calendar.clearSchedule')}</Text>
      <TouchableOpacity 
        style={styles.emptyAction}
        onPress={() => Alert.alert(t('calendar.scheduleInterview'), 'Opening scheduling modal...')}
      >
        <Text style={styles.emptyActionText}>{t('calendar.scheduleNew')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => {
    const monthIndex = currentMonthDate.getMonth();
    const year = currentMonthDate.getFullYear();
    
    return (
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerMainTitle}>{t('calendar.title')}</Text>
            <View style={styles.monthNav}>
              <Text style={styles.headerMonth}>{t('calendar.months')[monthIndex]} {year}</Text>
              <TouchableOpacity style={styles.navIcon} onPress={() => navigateMonth('prev')}>
                <Ionicons name="chevron-back" size={20} color={Colors.primary[800]} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navIcon} onPress={() => navigateMonth('next')}>
                <Ionicons name="chevron-forward" size={20} color={Colors.primary[800]} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.todayBtn} onPress={goToToday}>
            <Text style={styles.todayBtnText}>{t('common.today')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerFilters}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleBtn, viewType === 'month' && styles.toggleBtnActive]}
              onPress={() => setViewType('month')}
            >
              <Text style={[styles.toggleText, viewType === 'month' && styles.toggleTextActive]}>
                {t('calendar.month')}
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
            <TouchableOpacity 
              style={[styles.chip, filterType === 'all' && styles.chipActive]} 
              onPress={() => setFilterType('all')}
            >
              <Text style={[styles.chipText, filterType === 'all' && styles.chipTextActive]}>{t('welcome.filters.all')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.chip, filterType === 'technical' && styles.chipActive]} 
              onPress={() => setFilterType('technical')}
            >
              <Text style={[styles.chipText, filterType === 'technical' && styles.chipTextActive]}>Technical</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.chip, filterType === 'hr' && styles.chipActive]} 
              onPress={() => setFilterType('hr')}
            >
              <Text style={[styles.chipText, filterType === 'hr' && styles.chipTextActive]}>HR</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}

      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarContainer}>
          <View style={styles.weekDaysHeader}>
            {(t('calendar.days') as string[]).map((d: string) => (
              <Text key={d} style={styles.weekDayText}>{d}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {daysInView.map((day, idx) => {
              const isToday = isSameDay(day.date, new Date());
              const isSelected = isSameDay(day.date, selectedDate);
              
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    isToday && !isSelected && styles.dayCellToday,
                    !day.isCurrentMonth && { opacity: 0.3 }
                  ]}
                  onPress={() => setSelectedDate(day.date)}
                >
                  <Text style={[
                    styles.dayText,
                    isSelected && styles.dayTextSelected,
                    isToday && !isSelected && styles.dayTextToday,
                  ]}>
                    {day.date.getDate()}
                  </Text>
                  <View style={styles.loadIndicatorContainer}>
                    {Array.from({ length: Math.min(day.load, 3) }).map((_, i) => (
                      <View 
                        key={i} 
                        style={[
                          styles.loadDot, 
                          isSelected && styles.loadDotSelected,
                          day.load >= 3 && i === 0 && { backgroundColor: Colors.accent.red }
                        ]} 
                      />
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.scheduleHeader}>
          <View>
            <Text style={styles.scheduleTitle}>
              {isSameDay(selectedDate, new Date())
                ? t('calendar.todayInterviews') 
                : t('calendar.scheduleFor', { date: `${selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` })}
            </Text>
            <Text style={styles.interviewsCount}>
              {filteredInterviews.length === 1 
                ? t('calendar.interviewsCountSingular') 
                : t('calendar.interviewsCount', { count: filteredInterviews.length })}
            </Text>
          </View>
          {filteredInterviews.some(it => it.status === 'live') && (
            <View style={styles.liveIndicator}>
              <View style={styles.livePulse} />
              <Text style={styles.liveText}>{t('calendar.liveNow')}</Text>
            </View>
          )}
        </View>

        <View style={styles.listContainer}>
          {filteredInterviews.length > 0 ? (
            filteredInterviews.map((item) => (
              <View key={item.id}>
                {renderInterview({ item })}
              </View>
            ))
          ) : (
            renderEmptyState()
          )}
          <View style={{ height: verticalScale(140) }} />
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[
          styles.fab, 
          { bottom: insets.bottom + verticalScale(100) }
        ]}
        activeOpacity={0.8}
        onPress={() => Alert.alert(t('calendar.scheduleInterview'), 'Opening scheduling modal...')}
      >
        <Ionicons name="add" size={moderateScale(28)} color={Colors.white} />
        <Text style={styles.fabText}>{t('calendar.scheduleInterview')}</Text>
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
    backgroundColor: Colors.white,
    paddingTop: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing[4],
    marginBottom: Spacing[4],
  },
  headerMainTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: scale(1),
    marginBottom: verticalScale(4),
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerMonth: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginRight: scale(8),
  },
  navIcon: {
    padding: moderateScale(4),
    marginLeft: scale(4),
  },
  todayBtn: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.full,
  },
  todayBtnText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[800],
  },
  headerFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.gray[100],
    padding: moderateScale(2),
    borderRadius: BorderRadius.md,
    marginRight: Spacing[3],
  },
  toggleBtn: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(6),
  },
  toggleBtnActive: {
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  toggleText: {
    fontSize: moderateScale(11),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.primary[800],
  },
  filterScroll: {
    flex: 1,
  },
  filterContent: {
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing[2],
  },
  chipActive: {
    backgroundColor: Colors.primary[800],
    borderColor: Colors.primary[800],
  },
  chipText: {
    fontSize: moderateScale(11),
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.white,
  },
  calendarContainer: {
    backgroundColor: Colors.white,
    paddingBottom: Spacing[4],
  },
  weekDaysHeader: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    marginBottom: verticalScale(8),
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: moderateScale(10),
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
    height: verticalScale(54),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    marginVertical: verticalScale(2),
  },
  dayCellSelected: {
    backgroundColor: Colors.primary[800],
    ...Shadows.md,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: Colors.primary[800],
  },
  dayText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  dayTextSelected: {
    color: Colors.white,
  },
  dayTextToday: {
    color: Colors.primary[800],
  },
  loadIndicatorContainer: {
    flexDirection: 'row',
    height: verticalScale(4),
    marginTop: verticalScale(4),
    justifyContent: 'center',
  },
  loadDot: {
    width: scale(4),
    height: scale(4),
    borderRadius: moderateScale(2),
    backgroundColor: Colors.gray[300],
    marginHorizontal: scale(1),
  },
  loadDotSelected: {
    backgroundColor: Colors.white,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: verticalScale(20),
    backgroundColor: Colors.background,
  },
  scheduleTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  interviewsCount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: verticalScale(2),
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent.green + '15',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: BorderRadius.full,
  },
  livePulse: {
    width: scale(8),
    height: scale(8),
    borderRadius: moderateScale(4),
    backgroundColor: Colors.accent.green,
    marginRight: scale(6),
  },
  liveText: {
    fontSize: moderateScale(11),
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent.green,
  },
  listContainer: {
    paddingHorizontal: Spacing[4],
  },
  interviewCard: {
    backgroundColor: Colors.white,
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.05,
        shadowRadius: moderateScale(10),
      },
      android: {
        elevation: 2,
      },
    }),
  },
  nextInterviewCard: {
    borderColor: Colors.primary[300],
    borderWidth: 2,
  },
  nextTag: {
    position: 'absolute',
    top: verticalScale(-12),
    left: Spacing[4],
    backgroundColor: Colors.primary[800],
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
    ...Shadows.sm,
  },
  nextTagText: {
    color: Colors.white,
    fontSize: moderateScale(10),
    fontWeight: Typography.fontWeight.extraBold,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginRight: scale(8),
  },
  durationBadge: {
    backgroundColor: Colors.gray[50],
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: Colors.gray[100],
  },
  durationText: {
    fontSize: moderateScale(10),
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.bold,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: BorderRadius.full,
  },
  statusDotSmall: {
    width: scale(6),
    height: scale(6),
    borderRadius: moderateScale(3),
    marginRight: scale(6),
  },
  statusLabel: {
    fontSize: moderateScale(11),
    fontWeight: Typography.fontWeight.bold,
  },
  candidateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[4],
    backgroundColor: Colors.gray[50],
    padding: moderateScale(12),
    borderRadius: BorderRadius.lg,
  },
  candidateInfo: {
    marginLeft: scale(12),
    flex: 1,
  },
  candidateName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  jobTitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: verticalScale(2),
  },
  chevron: {
    marginLeft: scale(8),
  },
  detailsContainer: {
    marginBottom: Spacing[4],
    paddingHorizontal: scale(4),
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: verticalScale(8),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(16),
    flex: 1,
  },
  detailText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginLeft: scale(8),
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtnMain: {
    backgroundColor: Colors.primary[800],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: BorderRadius.md,
    flex: 2,
    marginRight: scale(8),
  },
  actionBtnTextMain: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    marginLeft: scale(6),
  },
  actionBtnSecondary: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(8),
    borderRadius: BorderRadius.md,
    flex: 1.5,
    marginRight: scale(8),
  },
  actionBtnTextSecondary: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
  },
  actionBtnIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(40),
    marginTop: verticalScale(16),
  },
  emptyIconContainer: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    backgroundColor: Colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: verticalScale(4),
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: verticalScale(24),
  },
  emptyAction: {
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.full,
  },
  emptyActionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[800],
  },
  fab: {
    position: 'absolute',
    right: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[700],
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(30),
    ...Shadows.lg,
    zIndex: 999,
  },
  fabText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    marginLeft: scale(8),
  },
});



