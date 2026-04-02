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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
  },
});
