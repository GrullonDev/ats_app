<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig, WeekCalendar } from 'react-native-calendars';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '@constants/index';
import { useTranslation } from '@hooks/useTranslation';
import { CalendarHeader, InterviewCard } from '@components/ui';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

// Configuración de locales para react-native-calendars
LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene.','Feb.','Mar.','Abr.','May.','Jun.','Jul.','Ago.','Sep.','Oct.','Nov.','Dic.'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  today: 'Hoy'
};

LocaleConfig.locales['en'] = {
  monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  monthNamesShort: ['Jan.','Feb.','Mar.','Apr.','May.','Jun.','Jul.','Ago.','Sep.','Oct.','Nov.','Dec.'],
  dayNames: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  dayNamesShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
  today: 'Today'
};

/**
 * Entrevistas iniciales
>>>>>>> main
 */
const INITIAL_INTERVIEWS: Record<string, any[]> = {
  '2026-04-02': [
    {
      id: '1',
      candidateName: 'Sofia Martinez',
      jobTitle: 'Senior Software Engineer',
      time: '10:00 AM',
      duration: '45m',
      type: 'technical',
      status: 'interviewing',
      interviewers: ['Jorge G.', 'Ana L.'],
    },
    {
      id: '2',
      candidateName: 'Carlos Ruiz',
      jobTitle: 'UX/UI Designer',
      time: '02:30 PM',
      duration: '60m',
      type: 'video',
      status: 'review',
      interviewers: ['Jorge G.'],
    },
  ],
  '2026-04-03': [
    {
      id: '3',
      candidateName: 'Elena Gomez',
      jobTitle: 'Product Manager',
      time: '11:00 AM',
      duration: '30m',
      type: 'hr',
      status: 'screening',
      interviewers: ['Luis M.'],
    },
  ],
  '2026-04-06': [
    {
      id: '4',
      candidateName: 'Roberto Caro',
      jobTitle: 'Full Stack Dev',
      time: '09:00 AM',
      duration: '60m',
      type: 'technical',
      status: 'new',
      interviewers: ['Jorge G.'],
    },
  ]
};

const calendarTheme = {
  backgroundColor: Colors.background,
  calendarBackground: Colors.white,
  textSectionTitleColor: Colors.textSecondary,
  selectedDayBackgroundColor: Colors.primary[700],
  selectedDayTextColor: Colors.white,
  todayTextColor: Colors.primary[700],
  dayTextColor: Colors.textPrimary,
  textDisabledColor: Colors.gray[300],
  dotColor: Colors.primary[700],
  selectedDotColor: Colors.white,
  arrowColor: Colors.primary[700],
  monthTextColor: Colors.textPrimary,
  indicatorColor: Colors.primary[700],
  textDayFontFamily: 'Inter-Regular',
  textMonthFontFamily: 'Inter-Bold',
  textDayHeaderFontFamily: 'Inter-Medium',
  textDayFontWeight: '400' as const,
  textMonthFontWeight: 'bold' as const,
  textDayHeaderFontWeight: '500' as const,
  textDayFontSize: 14,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 12,
};

export default function CalendarTab() {
<<<<<<< HEAD
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
=======
  const { t, locale } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');
  const [interviewsData, setInterviewsData] = useState(INITIAL_INTERVIEWS);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // Form State para nueva entrevista
  const [newCandidate, setNewCandidate] = useState('');
  const [newPosition, setNewPosition] = useState('');

  // Actualizar el idioma del calendario globalmente cuando cambie el locale de la app
  useEffect(() => {
    LocaleConfig.defaultLocale = locale;
  }, [locale]);

  const interviews = interviewsData[selectedDate] || [];

  const dateFnsLocale = locale === 'es' ? es : enUS;

  const formattedSelectedDate = format(parseISO(selectedDate), locale === 'es' ? "EEEE, d 'de' MMMM" : "EEEE, MMMM do", { locale: dateFnsLocale });

  const markedDates = Object.keys(interviewsData).reduce((acc, date) => {
    acc[date] = { 
      marked: true, 
      dotColor: Colors.primary[700],
      selected: date === selectedDate,
      selectedColor: Colors.primary[700],
    };
    return acc;
  }, {} as any);

  if (!markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: Colors.primary[700],
    };
  }

  const handleSaveInterview = () => {
    if (!newCandidate.trim() || !newPosition.trim()) return;

    const newInterview = {
      id: Math.random().toString(36).substr(2, 9),
      candidateName: newCandidate,
      jobTitle: newPosition,
      time: '09:00 AM',
      duration: '30m',
      type: 'video',
      status: 'new',
      interviewers: ['Jorge G.'],
    };

    setInterviewsData(prev => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newInterview]
    }));

    setNewCandidate('');
    setNewPosition('');
    setIsAddModalVisible(false);
  };

  const handleJoinCall = (id: string, name: string) => {
    Alert.alert(
      t('calendar.actions.join'),
      `${t('calendar.actions.joiningCall')}\n\nCandidato: ${name}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleReschedule = (id: string, name: string) => {
    Alert.alert(
      t('calendar.actions.reschedule'),
      `${t('calendar.actions.rescheduleSent')}\n\nCandidato: ${name}`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.confirm'), onPress: () => console.log('Reschedule confirmed for', id) }
      ]
    );
  };

  const renderCalendarContent = () => {
    switch (viewMode) {
      case 'month':
        return (
          <Calendar
            key={`calendar-${locale}-${selectedDate}`}
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={calendarTheme}
            style={styles.calendar}
          />
        );
      case 'week':
        return (
          <View style={styles.weekCalendarWrapper}>
            <WeekCalendar
              key={`week-${locale}-${selectedDate}`}
              current={selectedDate}
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              theme={calendarTheme}
            />
          </View>
        );
      case 'day':
        return (
          <View style={styles.dayViewHeader}>
            <View style={styles.dayIndicator}>
              <Text style={styles.dayText}>{format(parseISO(selectedDate), 'dd')}</Text>
              <Text style={styles.monthText}>
                {format(parseISO(selectedDate), 'MMM', { locale: dateFnsLocale }).toUpperCase()}
              </Text>
            </View>
            <View style={styles.dayDetails}>
              <Text style={styles.dayNameText}>
                {format(parseISO(selectedDate), 'EEEE', { locale: dateFnsLocale })}
              </Text>
              <Text style={styles.daySubtext}>
                {interviews.length > 0 
                  ? `${interviews.length} ${t('calendar.interviews')}`
                  : t('calendar.noEvents')
                }
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CalendarHeader 
        title={t('calendar.title')}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddEvent={() => setIsAddModalVisible(true)}
      />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={viewMode !== 'day' ? [0] : undefined}
      >
        <View style={[
          styles.calendarWrapper,
          viewMode === 'day' && styles.calendarWrapperDay
        ]}>
          {renderCalendarContent()}
        </View>

        <View style={styles.agendaContainer}>
          <View style={styles.agendaHeader}>
            <View>
              <Text style={styles.agendaTitle}>
                {viewMode === 'day' ? t('calendar.todaySchedule') : formattedSelectedDate}
              </Text>
              {viewMode !== 'day' && (
                <Text style={styles.agendaSubtitle}>
                  {interviews.length} {interviews.length === 1 ? t('calendar.interview') : t('calendar.interviews')}
                </Text>
              )}
            </View>
          </View>

          {interviews.length > 0 ? (
            interviews.map((item) => (
              <InterviewCard
                key={item.id}
                candidateName={item.candidateName}
                jobTitle={item.jobTitle}
                time={item.time}
                duration={item.duration}
                type={item.type}
                status={item.status}
                interviewers={item.interviewers}
                onJoin={() => handleJoinCall(item.id, item.candidateName)}
                onReschedule={() => handleReschedule(item.id, item.candidateName)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="calendar-clear-outline" size={48} color={Colors.gray[200]} />
              </View>
              <Text style={styles.emptyText}>{t('calendar.noEvents')}</Text>
            </View>
          )}
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botón flotante para nueva entrada */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setIsAddModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>

      {/* Modal para Programar Entrevista */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('calendar.addEvent')}</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('applicants.fullNamePlaceholder')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('applicants.fullNamePlaceholder')}
                value={newCandidate}
                onChangeText={setNewCandidate}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('jobs.title')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('applicants.unknownPosition')}
                value={newPosition}
                onChangeText={setNewPosition}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveInterview}
              >
                <Text style={styles.saveButtonText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
>>>>>>> main
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
<<<<<<< HEAD
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
=======
  scrollView: {
    flex: 1,
  },
  calendarWrapper: {
    backgroundColor: Colors.white,
    paddingBottom: Spacing[4],
    borderBottomLeftRadius: BorderRadius['3xl'],
    borderBottomRightRadius: BorderRadius['3xl'],
    ...Shadows.md,
    zIndex: 10,
  },
  calendarWrapperDay: {
    paddingBottom: Spacing[6],
  },
  weekCalendarWrapper: {
    paddingHorizontal: Spacing[2],
  },
  calendar: {
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing[4],
  },
  dayViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[2],
  },
  dayIndicator: {
    backgroundColor: Colors.primary[700],
    width: 60,
    height: 60,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  dayText: {
    fontSize: 22,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    lineHeight: 26,
  },
  monthText: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[100],
    letterSpacing: 1,
  },
  dayDetails: {
    marginLeft: Spacing[4],
  },
  dayNameText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textTransform: 'capitalize',
  },
  daySubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  agendaContainer: {
    padding: Spacing[4],
    paddingTop: Spacing[6],
  },
  agendaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  agendaTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textTransform: 'capitalize',
  },
  agendaSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[10],
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.divider,
    borderStyle: 'dashed',
  },
  emptyIconContainer: {
    marginBottom: Spacing[4],
  },
  emptyText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing[8],
  },
  fab: {
    position: 'absolute',
    right: Spacing[6],
    bottom: Spacing[6],
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
    elevation: 8,
    zIndex: 100,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['3xl'],
    borderTopRightRadius: BorderRadius['3xl'],
    padding: Spacing[6],
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  inputContainer: {
    marginBottom: Spacing[4],
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginTop: Spacing[4],
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.gray[100],
  },
  cancelButtonText: {
    color: Colors.gray[700],
    fontWeight: Typography.fontWeight.bold,
  },
  saveButton: {
    backgroundColor: Colors.primary[700],
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
>>>>>>> main
  },
});



