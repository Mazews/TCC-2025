import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  Dimensions, 
  ActivityIndicator,
  Animated,
  RefreshControl,
  StatusBar
} from 'react-native';
import AppText from './AppText';
import { useTheme } from './ThemeContext';
import api from './api';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const getTasksBg = theme => theme.tasksImage || (theme.mode === 'dark' ? require('../assets/bgdark2.png') : require('../assets/loginbg.png'));

export default function TasksScreen({ navigation }) {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const tasksAnimatedValues = useRef({}).current;

  useEffect(() => {
    // Animação de fade in inicial
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Animação flutuante contínua
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const paths = ['/tasks', '/user/tasks', '/todos', '/tasks/me', '/me/tasks'];
    for (const p of paths) {
      try {
        const res = await api.apiFetch(p);
        // Normalize: if res.data or res.tasks or array
        const arr = res?.data || res?.tasks || (Array.isArray(res) ? res : null) || (res && res.items) || null;
        if (Array.isArray(arr)) {
          setTasks(arr);
          setLoading(false);
          return;
        }
      } catch (e) {
        // try next
      }
    }
    // if nothing returned, empty list
    setTasks([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  // Função para alternar status da tarefa
  const toggleTask = async (taskId) => {
    try {
      // Otimistic update
      setTasks(prevTasks =>
        prevTasks.map(task => {
          const id = task.id || task._id;
          if (id?.toString() === taskId.toString()) {
            return { ...task, done: !task.done, completed: !task.completed };
          }
          return task;
        })
      );

      // API call para atualizar no backend
      await api.apiFetch(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({
          done: !tasks.find(t => (t.id || t._id)?.toString() === taskId.toString())?.done
        })
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      // Reverter mudança em caso de erro
      await fetchTasks();
    }
  };

  // Estatísticas das tarefas
  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.done || task.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const getPriorityStyle = (priority) => {
    const p = (priority || 'média').toLowerCase();
    if (p.includes('alta') || p.includes('high')) {
      return { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.3)', text: '#fca5a5' };
    } else if (p.includes('média') || p.includes('medium')) {
      return { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24' };
    } else {
      return { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.3)', text: '#4ade80' };
    }
  };

  const getPriorityText = (priority) => {
    const p = (priority || 'média').toLowerCase();
    if (p.includes('alta') || p.includes('high')) return 'ALTA';
    if (p.includes('média') || p.includes('medium')) return 'MÉDIA';
    return 'BAIXA';
  };

  // Função para criar animação única para cada tarefa
  const getTaskAnimation = (taskId) => {
    if (!tasksAnimatedValues[taskId]) {
      tasksAnimatedValues[taskId] = {
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1),
      };
    }
    return tasksAnimatedValues[taskId];
  };

  const FloatingShape = ({ style }) => {
    const translateY = floatingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -30],
    });

    const rotate = floatingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        style={[
          styles.floatingShape,
          style,
          { 
            transform: [
              { translateY },
              { rotate }
            ] 
          }
        ]}
      />
    );
  };

  const StatCard = ({ number, label, delay = 0 }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }).start();
    }, [number]);

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }], flex: 1 }}>
        <BlurView intensity={20} tint="dark" style={styles.statCard}>
          <AppText style={styles.statNumber}>{number}</AppText>
          <AppText style={styles.statLabel}>{label}</AppText>
        </BlurView>
      </Animated.View>
    );
  };

  function renderTask({ item, index }) {
    // Accept multiple field names from backend
    const taskId = item.id || item._id;
    const title = item.title || item.name || item.titulo || item.description || item.task || 'Tarefa';
    const note = item.note || item.description || item.descricao || '';
    const priority = item.priority || item.prioridade || item.level || 'média';
    const done = item.done || item.completed || item.concluida || false;
    const time = item.time || item.hora || item.deadline || 'Sem horário definido';

    const priorityStyle = getPriorityStyle(priority);
    const animation = getTaskAnimation(taskId);

    const handleTaskPress = () => {
      Animated.sequence([
        Animated.timing(animation.scale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animation.scale, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animation.scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.timing(animation.opacity, {
        toValue: done ? 1 : 0.6,
        duration: 300,
        useNativeDriver: true,
      }).start();

      toggleTask(taskId);
    };

    return (
      <Animated.View
        style={[
          styles.taskContainer,
          {
            transform: [{ scale: animation.scale }],
            opacity: done ? 0.7 : 1,
          }
        ]}
      >
        <BlurView intensity={15} tint="dark" style={styles.taskBlur}>
          <TouchableOpacity onPress={handleTaskPress} activeOpacity={0.8}>
            <View style={styles.taskContent}>
              <View style={styles.taskHeader}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    done && styles.checkboxCompleted
                  ]}
                  onPress={handleTaskPress}
                >
                  {done && <Icon name="check" size={16} color="#fff" />}
                </TouchableOpacity>
                
                <View style={styles.taskInfo}>
                  <AppText
                    style={[
                      styles.taskTitle,
                      { color: theme.text },
                      done && styles.taskTitleCompleted
                    ]}
                  >
                    {title}
                  </AppText>
                  {note ? (
                    <AppText style={[styles.taskDescription, { color: theme.textSecondary }]}>
                      {note}
                    </AppText>
                  ) : null}
                </View>

                <View
                  style={[
                    styles.priorityBadge,
                    { 
                      backgroundColor: priorityStyle.bg,
                      borderColor: priorityStyle.border 
                    }
                  ]}
                >
                  <AppText style={[styles.priorityText, { color: priorityStyle.text }]}>
                    {getPriorityText(priority)}
                  </AppText>
                </View>
              </View>

              <View style={[styles.taskMeta, { borderTopColor: theme.textSecondary + '20' }]}>
                <AppText style={[styles.taskTime, { color: theme.textSecondary }]}>
                  {done ? '✅ Concluída' : `⏰ ${time}`}
                </AppText>
              </View>
            </View>
          </TouchableOpacity>
        </BlurView>
      </Animated.View>
    );
  }

  const stats = getStats();
  const currentDate = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
      
      <ImageBackground
        source={getTasksBg(theme)}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover' }}
      >
        {/* Formas flutuantes decorativas */}
        <FloatingShape style={styles.shape1} />
        <FloatingShape style={styles.shape2} />
        <FloatingShape style={styles.shape3} />

        <Animated.View 
          style={[
            styles.modernCard, 
            { backgroundColor: theme.card + 'E6' }, // Adiciona transparência
            { opacity: fadeAnim }
          ]}
        >
          {/* Header com gradiente */}
          <View style={styles.header}>
            <View style={styles.notch} />
            <AppText style={[styles.date, { color: theme.textSecondary }]}>
              {currentDate}
            </AppText>
            <LinearGradient
              colors={theme.mode === 'dark' ? ['#ffffff', '#a8edea'] : ['#2d1b69', '#11998e']}
              style={styles.titleGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <AppText style={styles.modernTitle}>Suas Tarefas</AppText>
            </LinearGradient>
            <AppText style={[styles.subtitle, { color: theme.textSecondary }]}>
              {stats.pending} tarefas para hoje
            </AppText>
          </View>

          {/* Estatísticas */}
          {tasks.length > 0 && (
            <View style={styles.statsContainer}>
              <StatCard number={stats.total} label="Total" delay={0} />
              <StatCard number={stats.completed} label="Concluídas" delay={100} />
              <StatCard number={stats.pending} label="Pendentes" delay={200} />
            </View>
          )}

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <AppText style={[styles.sectionTitle, { color: theme.text }]}>
              {tasks.length > 0 ? 'Hoje' : ''}
            </AppText>
            {tasks.length > 0 && (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => {/* TODO: open create task modal */}}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.addButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="plus" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* Loading ou Lista de Tarefas */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.switchThumb2} />
              <AppText style={[styles.loadingText, { color: theme.textSecondary }]}>
                Carregando suas tarefas...
              </AppText>
            </View>
          ) : tasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="coffee" size={60} color={theme.textSecondary} />
              <AppText style={[styles.emptyText, { color: theme.textSecondary }]}>
                Sem tarefas por hoje, descanse :)
              </AppText>
            </View>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(item, idx) => (item.id || item._id || idx).toString()}
              renderItem={renderTask}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[theme.switchThumb2]}
                  tintColor={theme.switchThumb2}
                />
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tasksContainer}
            />
          )}

          {/* Botão de voltar moderno */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <LinearGradient
              colors={[theme.switchThumb2, theme.switchThumb2 + '80']}
              style={styles.backButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="arrow-left" size={20} color="#fff" style={{ marginRight: 8 }} />
              <AppText style={styles.backButtonText}>Voltar</AppText>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* FAB para adicionar tarefa */}
        {tasks.length > 0 && (
          <TouchableOpacity 
            style={styles.fab}
            onPress={() => {/* TODO: open create task modal */}}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.fabGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="plus" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernCard: {
    width: width > 500 ? 420 : width * 0.9,
    maxHeight: height * 0.85,
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 25,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowColor: 'rgba(0, 0, 0, 0)',
    elevation: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  notch: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 15,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '500',
    marginBottom: 8,
  },
  titleGradient: {
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  modernTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: 'transparent',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 12,
  },
  statCard: {
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 80,
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#4ade80',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
  },
  addButtonGradient: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tasksContainer: {
    paddingBottom: 20,
  },
  taskContainer: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  taskBlur: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  taskContent: {
    padding: 20,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  checkboxCompleted: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  taskInfo: {
    flex: 1,
    marginRight: 15,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 6,
    lineHeight: 22,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskDescription: {
    fontSize: 14,
    fontFamily: 'Poppins',
    lineHeight: 20,
    opacity: 0.8,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  taskMeta: {
    paddingTop: 15,
    borderTopWidth: 1,
  },
  taskTime: {
    fontSize: 13,
    fontFamily: 'Poppins',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins',
    marginTop: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 26,
  },
  backButton: {
    alignSelf: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 20,
  },
  backButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});