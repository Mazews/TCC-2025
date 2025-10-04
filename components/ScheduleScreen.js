import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ImageBackground, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AppText from './AppText';
import { ThemeContext } from './ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather as Icon } from '@expo/vector-icons';
import { safeLog, safeError } from './log';

const { width } = Dimensions.get('window');
const API_BASE = 'https://backend-feelflow-core.onrender.com'; // ajuste se necessário

function ScheduleScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        const res = await fetch(`${API_BASE}/appointments/pending`, {
          method: 'GET',
          headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
        });

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          safeLog('Schedule fetch raw', text?.slice(0, 200));
          try {
            const r2 = await fetch(`${API_BASE}/appointments/pending`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            });
            const t2 = await r2.text();
            data = JSON.parse(t2);
          } catch (e2) {
            safeError('Schedule parse', e2);
            data = { appointments: [] };
          }
        }

        const list = data?.appointments || data?.data || data || [];
        if (mounted) setAppointments(Array.isArray(list) ? list : [list]);
      } catch (err) {
        safeError('fetchAppointments', err);
        if (mounted) setAppointments([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAppointments();
    return () => {
      mounted = false;
    };
  }, []);

  const performAction = async (id, type = 'confirm') => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const endpoints =
        type === 'confirm'
          ? [
              `${API_BASE}/appointments/${id}/confirm`,
              `${API_BASE}/appointments/${id}/status`,
              `${API_BASE}/appointments/${id}`,
            ]
          : [
              `${API_BASE}/appointments/${id}/cancel`,
              `${API_BASE}/appointments/${id}/status`,
              `${API_BASE}/appointments/${id}`,
            ];

      let success = false;
      for (const ep of endpoints) {
        try {
          const method = ep.endsWith('/status') || ep.endsWith(`/${id}`) ? 'PATCH' : 'POST';
          const body = method === 'PATCH' ? JSON.stringify({ status: type === 'confirm' ? 'confirmed' : 'cancelled' }) : JSON.stringify({ token });
          const res = await fetch(ep, {
            method,
            headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
            body,
          });
          const text = await res.text();
          let parsed;
          try {
            parsed = JSON.parse(text);
          } catch {
            parsed = { raw: text };
          }
          if (res.ok) {
            safeLog('performAction success', ep, parsed);
            success = true;
            break;
          } else {
            safeLog('performAction non-ok', ep, res.status, parsed);
          }
        } catch (e) {
          safeError('performAction try', e);
        }
      }

      if (success) {
        Alert.alert(type === 'confirm' ? 'Agendamento confirmado' : 'Agendamento recusado');
        setAppointments(prev => prev.filter(a => a.id !== id && a._id !== id && a.appointmentId !== id));
      } else {
        Alert.alert('Erro', 'Não foi possível completar a ação. Verifique o console.');
      }
    } catch (err) {
      safeError('performAction', err);
      Alert.alert('Erro', 'Ocorreu um erro. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const appt = appointments && appointments.length ? appointments[0] : null;

  return (
    <ImageBackground
      source={theme.mode === 'dark' ? require('../assets/bgdark2.png') : require('../assets/loginbg.png')}
      style={[styles.background, { backgroundColor: theme.background }]}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <View style={[styles.wrapper]}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={[styles.iconCircle, { backgroundColor: withAlpha(theme.card, 0.16), borderColor: withAlpha(theme.card, 0.25) }] }>
            <Icon name="clock" size={26} color={theme.textSecondary} />
          </View>

          <AppText style={[styles.title, { color: theme.text }]}>Agendamento</AppText>
          <AppText style={[styles.subtitle, { color: theme.textSecondary }]}> {appt ? (appt.status ? String(appt.status).replace('_', ' ') : 'Pendente de confirmação') : 'Pendente de confirmação'}</AppText>

          <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 8 }}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 24 }} />
            ) : appt ? (
              <>
                <View style={[styles.infoBox, { backgroundColor: withAlpha(theme.card, 0.14) }]}>
                  <View style={styles.infoRow}>
                    <View style={styles.iconWrap}>
                      <Icon name="calendar" size={18} color={theme.text} />
                    </View>
                    <View style={styles.infoText}>
                      <AppText style={[styles.infoLabel, { color: theme.textSecondary }]}>Data</AppText>
                      <AppText style={[styles.infoValue, { color: theme.text }]}>{formatDate(appt.date || appt.scheduledAt || appt.datetime)}</AppText>
                    </View>
                  </View>

                  <View style={[styles.infoRow, { marginTop: 12 }]}>
                    <View style={styles.iconWrap}>
                      <Icon name="clock" size={18} color={theme.text} />
                    </View>
                    <View style={styles.infoText}>
                      <AppText style={[styles.infoLabel, { color: theme.textSecondary }]}>Horário</AppText>
                      <AppText style={[styles.infoValue, { color: theme.text }]}>{formatTime(appt.time || appt.hour || appt.scheduledTime || appt.datetime)}</AppText>
                    </View>
                  </View>
                </View>

                <View style={[styles.infoBox, { marginTop: 12, backgroundColor: withAlpha(theme.card, 0.14) }]}>
                  <View style={styles.infoRow}>
                    <View style={styles.iconWrap}>
                      <Icon name="user" size={18} color={theme.text} />
                    </View>
                    <View style={styles.infoText}>
                      <AppText style={[styles.infoLabel, { color: theme.textSecondary }]}>Profissional</AppText>
                      <AppText style={[styles.infoValue, { color: theme.text }]}>{appt.doctor?.name || appt.doctorName || appt.provider || appt.professional || '—'}</AppText>
                      <AppText style={[styles.infoSubtitle, { color: theme.textSecondary }]}>{appt.doctor?.specialty || appt.specialty || ''}</AppText>
                    </View>
                  </View>
                </View>

                <View style={[styles.infoBox, { marginTop: 12, backgroundColor: withAlpha(theme.card, 0.14) }]}>
                  <View style={styles.infoRow}>
                    <View style={styles.iconWrap}>
                      <Icon name="map-pin" size={18} color={theme.text} />
                    </View>
                    <View style={styles.infoText}>
                      <AppText style={[styles.infoLabel, { color: theme.textSecondary }]}>Local</AppText>
                      <AppText style={[styles.infoValue, { color: theme.text }]}>{appt.clinic?.name || appt.clinicName || appt.location || '—'}</AppText>
                      <AppText style={[styles.infoSubtitle, { color: theme.textSecondary }]}>{appt.clinic?.address || appt.address || ''}</AppText>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <AppText style={[styles.emptyText, { color: theme.textSecondary }]}>Nenhum agendamento pendente.</AppText>
            )}
          </ScrollView>

          <AppText style={[styles.confirmText, { color: theme.text }]}>Confirmar consulta?</AppText>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              disabled={!appt || actionLoading}
              style={[styles.actionBtn, styles.confirmBtn, { opacity: !appt || actionLoading ? 0.6 : 1 }]}
              onPress={() =>
                Alert.alert('Confirmar', 'Confirmar este agendamento?', [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Confirmar', onPress: () => performAction(appt?.id || appt?._id || appt?.appointmentId, 'confirm') },
                ])
              }
            >
              <Icon name="thumbs-up" size={20} color="#fff" />
              <AppText style={styles.actionText}>Confirmar</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!appt || actionLoading}
              style={[styles.actionBtn, styles.cancelBtn, { opacity: !appt || actionLoading ? 0.6 : 1 }]}
              onPress={() =>
                Alert.alert('Recusar', 'Recusar este agendamento?', [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Recusar', onPress: () => performAction(appt?.id || appt?._id || appt?.appointmentId, 'cancel') },
                ])
              }
            >
              <Icon name="thumbs-down" size={20} color="#fff" />
              <AppText style={styles.actionText}>Recusar</AppText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.backButton }]} onPress={() => navigation.goBack()}>
            <AppText style={[styles.backButtonText, { color: theme.text }]}>voltar</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

function formatDate(value) {
  if (!value) return '—';
  try {
    const d = new Date(value);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  } catch {
    return String(value);
  }
}
function formatTime(value) {
  if (!value) return '—';
  try {
    const d = new Date(value);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(value).slice(0, 5);
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
    justifyContent: 'center', 
    alignItems: 'center' },
  wrapper: { 
    width: '100%', 
    alignItems: 'center', 
    paddingTop: 40, 
    paddingBottom: 32 },
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
    marginTop: 6 },
  subtitle: { 
    fontSize: 13, 
    marginTop: 4, 
    marginBottom: 6 },
  scroll: { 
    width: '100%', 
    maxHeight: 320, 
    marginTop: 8, 
    marginBottom: 10 },
  infoBox: { 
    borderRadius: 12, 
    padding: 14, 
    backgroundColor: 'rgba(255,255,255,0.2)' },
  infoRow: { 
    lexDirection: 'row', 
    alignItems: 'center' 
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 12,
    margintop: 20,
  },
  infoText: { 
    flex: 1 
  },
  infoLabel: { 
    fontSize: 12, 
    marginBottom: 4, 
    fontFamily: 'Poppins-Regular' 
  },
  infoValue: { 
    fontSize: 16, 
    fontFamily: 'Poppins-Bold' 
  },
  infoSubtitle: { 
    fontSize: 13, 
    marginTop: 6 
  },
  emptyText: { 
    paddingVertical: 30, 
    textAlign: 'center' 
  },
  confirmText: { 
    marginTop: 12, 
    fontSize: 16, 
    fontFamily: 'Poppins-Bold' 
  },
  actionsRow: { 
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'space-between', 
    marginTop: 12 
  },
  actionBtn: {
    flex: 1,
    height: 76,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  confirmBtn: { 
    backgroundColor: 'rgba(62, 208, 122, 1)' },
  cancelBtn: { 
    backgroundColor: 'rgba(243, 122, 119, 1)' },
  actionText: { 
    color: 'rgba(255, 255, 255, 1)', 
    fontSize: 16, 
    marginLeft: 8, 
    fontFamily: 'Poppins-Bold' },
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
    fontWeight: '600' },
});

export default ScheduleScreen;