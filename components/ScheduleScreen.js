import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ImageBackground, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AppText from './AppText';
import { ThemeContext } from './ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather as Icon } from '@expo/vector-icons';
import { safeLog, safeError } from './log';

const { width } = Dimensions.get('window');
const API_BASE = 'https://backend-fellsystem.vercel.app';

// Configuração do calendário em português
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

function AvailabilityScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    let mounted = true;
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        const res = await fetch(`${API_BASE}/appointments/availability/all`, {
          method: 'POST',
          body: JSON.stringify({ token }),
        });
        
        const data = await res.json();
        safeLog('Availability response:', data);
        
        const list = data?.appointments || [];
        if (mounted) {
          setAppointments(Array.isArray(list) ? list : []);
          generateMarkedDates(list);
        }
      } catch (err) {
        safeError('fetchAvailability', err);
        if (mounted) setAppointments([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAvailability();
    return () => {
      mounted = false;
    };
  }, []);

  const generateMarkedDates = (appointmentsList) => {
    const marked = {};
    appointmentsList.forEach(appt => {
      const dateKey = formatDateKey(appt.startTime);
      if (dateKey) {
        marked[dateKey] = {
          marked: true,
          dotColor: '#3ED07A',
          selected: false,
        };
      }
    });
    setMarkedDates(marked);
  };

  const formatDateKey = (dateString) => {
    try {
      const d = new Date(dateString);
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return null;
    }
  };

  const handleDayPress = (day) => {
    const dateKey = day.dateString;
    setSelectedDate(dateKey);
    setSelectedAppointment(null);
    
    // Atualiza marcações do calendário
    const newMarked = { ...markedDates };
    Object.keys(newMarked).forEach(key => {
      newMarked[key] = { ...newMarked[key], selected: false };
    });
    if (newMarked[dateKey]) {
      newMarked[dateKey] = { ...newMarked[dateKey], selected: true, selectedColor: '#3ED07A' };
    }
    setMarkedDates(newMarked);
  };

  const getAppointmentsForSelectedDate = () => {
    if (!selectedDate) return [];
    return appointments.filter(appt => {
      const apptDateKey = formatDateKey(appt.startTime);
      return apptDateKey === selectedDate;
    });
  };

  const confirmAppointment = async () => {
    if (!selectedAppointment) {
      Alert.alert('Atenção', 'Selecione um horário para confirmar.');
      return;
    }

    if (actionLoading) return;
    setActionLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch(`${API_BASE}/appointments/schedule`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ token, id: selectedAppointment._id }),
      });

      const data = await res.json();
      safeLog('Schedule response:', data);

      if (res.ok) {
        Alert.alert('Sucesso', 'Agendamento confirmado com sucesso!');
        // Recarrega disponibilidades
        setSelectedDate('');
        setSelectedAppointment(null);
        // Recarregar dados
        const updatedList = appointments.filter(a => a._id !== selectedAppointment._id);
        setAppointments(updatedList);
        generateMarkedDates(updatedList);
      } else {
        Alert.alert('Erro', data.message || 'Não foi possível confirmar o agendamento.');
      }
    } catch (err) {
      safeError('confirmAppointment', err);
      Alert.alert('Erro', 'Ocorreu um erro. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const availableSlots = getAppointmentsForSelectedDate();

  return (
    <ImageBackground
      source={theme.mode === 'dark' ? require('../assets/bgdark2.png') : require('../assets/loginbg.png')}
      style={[styles.background, { backgroundColor: theme.background }]}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapper}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={[styles.iconCircle, { backgroundColor: withAlpha(theme.card, 0.16), borderColor: withAlpha(theme.card, 0.25) }]}>
              <Icon name="calendar" size={26} color={theme.textSecondary} />
            </View>

            <AppText style={[styles.title, { color: theme.text }]}>Agendar Consulta</AppText>
            <AppText style={[styles.subtitle, { color: theme.textSecondary }]}>
              Selecione uma data disponível
            </AppText>

            {loading ? (
              <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 24, marginBottom: 24 }} />
            ) : (
              <>
                <View style={styles.calendarContainer}>
                  <Calendar
                    current={new Date().toISOString().split('T')[0]}
                    minDate={new Date().toISOString().split('T')[0]}
                    onDayPress={handleDayPress}
                    markedDates={markedDates}
                    theme={{
                      backgroundColor: 'transparent',
                      calendarBackground: 'transparent',
                      textSectionTitleColor: theme.text,
                      selectedDayBackgroundColor: '#3ED07A',
                      selectedDayTextColor: '#ffffff',
                      todayTextColor: '#3ED07A',
                      dayTextColor: theme.text,
                      textDisabledColor: withAlpha(theme.textSecondary, 0.3),
                      dotColor: '#3ED07A',
                      selectedDotColor: '#ffffff',
                      arrowColor: theme.text,
                      monthTextColor: theme.text,
                      textDayFontFamily: 'Poppins-Regular',
                      textMonthFontFamily: 'Poppins-Bold',
                      textDayHeaderFontFamily: 'Poppins-Regular',
                      textDayFontSize: 14,
                      textMonthFontSize: 16,
                      textDayHeaderFontSize: 12,
                    }}
                  />
                </View>

                {selectedDate && (
                  <>
                    <AppText style={[styles.sectionTitle, { color: theme.text }]}>
                      Horários Disponíveis
                    </AppText>

                    {availableSlots.length === 0 ? (
                      <AppText style={[styles.emptyText, { color: theme.textSecondary }]}>
                        Nenhum horário disponível para esta data.
                      </AppText>
                    ) : (
                      <View style={styles.slotsContainer}>
                        {availableSlots.map((appt) => (
                          <TouchableOpacity
                            key={appt._id}
                            style={[
                              styles.slotCard,
                              { backgroundColor: withAlpha(theme.card, 0.14) },
                              selectedAppointment?._id === appt._id && styles.slotCardSelected
                            ]}
                            onPress={() => setSelectedAppointment(appt)}
                          >
                            <View style={styles.slotHeader}>
                              <Icon 
                                name="clock" 
                                size={18} 
                                color={selectedAppointment?._id === appt._id ? '#3ED07A' : theme.text} 
                              />
                              <AppText style={[
                                styles.slotTime, 
                                { color: selectedAppointment?._id === appt._id ? '#3ED07A' : theme.text }
                              ]}>
                                {formatTime(appt.startTime)} - {formatTime(appt.endTime)}
                              </AppText>
                            </View>

                            {appt.duration && (
                              <View style={styles.slotInfo}>
                                <Icon name="activity" size={14} color={theme.textSecondary} />
                                <AppText style={[styles.slotInfoText, { color: theme.textSecondary }]}>
                                  Duração: {appt.duration} minutos
                                </AppText>
                              </View>
                            )}

                            {appt.createdBy && (
                              <View style={styles.slotInfo}>
                                <Icon name="user" size={14} color={theme.textSecondary} />
                                <AppText style={[styles.slotInfoText, { color: theme.textSecondary }]}>
                                  {appt.createdBy.name || 'Profissional'}
                                </AppText>
                              </View>
                            )}

                            {appt.organization && (
                              <View style={styles.slotInfo}>
                                <Icon name="map-pin" size={14} color={theme.textSecondary} />
                                <AppText style={[styles.slotInfoText, { color: theme.textSecondary }]}>
                                  {appt.organization.name || 'Organização'}
                                </AppText>
                              </View>
                            )}

                            {selectedAppointment?._id === appt._id && (
                              <View style={styles.selectedBadge}>
                                <Icon name="check" size={14} color="#fff" />
                              </View>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {selectedAppointment && (
                      <TouchableOpacity
                        disabled={actionLoading}
                        style={[
                          styles.confirmButton, 
                          { opacity: actionLoading ? 0.6 : 1 }
                        ]}
                        onPress={() =>
                          Alert.alert(
                            'Confirmar Agendamento', 
                            `Confirmar consulta para ${formatDate(selectedAppointment.startTime)} das ${formatTime(selectedAppointment.startTime)} às ${formatTime(selectedAppointment.endTime)}${selectedAppointment.duration ? ` (${selectedAppointment.duration} minutos)` : ''}?`,
                            [
                              { text: 'Cancelar', style: 'cancel' },
                              { text: 'Confirmar', onPress: confirmAppointment },
                            ]
                          )
                        }
                      >
                        {actionLoading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <>
                            <Icon name="check-circle" size={20} color="#fff" />
                            <AppText style={styles.confirmButtonText}>Confirmar Agendamento</AppText>
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </>
            )}

            <TouchableOpacity 
              style={[styles.backButton, { backgroundColor: theme.backButton }]} 
              onPress={() => navigation.goBack()}
            >
              <AppText style={[styles.backButtonText, { color: theme.text }]}>voltar</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function formatDate(value) {
  if (!value) return '—';
  try {
    const d = new Date(value);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });
  } catch {
    return String(value);
  }
}

function formatTime(value) {
  if (!value) return '—';
  try {
    const d = new Date(value);
    d.setHours(d.getHours() - 3);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
}

function withAlpha(hexOrColor, alpha) {
  try {
    if (typeof hexOrColor !== 'string') return hexOrColor;
    if (hexOrColor.startsWith('rgba') || hexOrColor.startsWith('rgb')) return hexOrColor;
    let hex = hexOrColor.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  } catch {
    return hexOrColor;
  }
}

const styles = StyleSheet.create({
  background: { 
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  wrapper: { 
    width: '100%', 
    alignItems: 'center',
  },
  card: {
    width: width > 500 ? 380 : width * 0.86,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -100,
    marginBottom: 40,
    borderWidth: 1,
  },
  title: { 
    fontSize: 22, 
    fontFamily: 'Poppins-Bold', 
    marginTop: 6 
  },
  subtitle: { 
    fontSize: 13, 
    marginTop: 4, 
    marginBottom: 16 
  },
  calendarContainer: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginTop: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  slotsContainer: {
    width: '100%',
    marginBottom: 12,
  },
  slotCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    position: 'relative',
  },
  slotCardSelected: {
    backgroundColor: 'rgba(62, 208, 122, 0.15)',
    borderWidth: 2,
    borderColor: '#3ED07A',
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  slotTime: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginLeft: 8,
  },
  slotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  slotInfoText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginLeft: 6,
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3ED07A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    width: '100%',
    backgroundColor: '#3ED07A',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginLeft: 8,
  },
  emptyText: { 
    paddingVertical: 20, 
    textAlign: 'center',
    fontSize: 14,
  },
  backButton: {
    width: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 32,
    paddingVertical: 12,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 14,
  },
  backButtonText: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
});

export default AvailabilityScreen;