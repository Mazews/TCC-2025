import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackedBarChart, LineChart } from 'react-native-chart-kit';
import AppText from './AppText';
import { ThemeContext } from './ThemeContext';
import Icon from 'react-native-vector-icons/Feather';

const screenWidth = Dimensions.get('window').width - 20;
const screenHeight = Dimensions.get('window').height;

// Emoções e cores fixas
const EMOTIONS = [
  { label: 'Feliz', color: '#FFD700', score: 4 },
  { label: 'Muito feliz', color: '#FFA500', score: 5 },
  { label: 'Triste', color: '#1E90FF', score: 2 },
  { label: 'Muito triste', color: '#4169E1', score: 1 },
  { label: 'Indiferente', color: '#808080', score: 3 },
  { label: 'Com raiva', color: '#bd0000ff', score: 2 },
  { label: 'Furioso', color: '#490000ff', score: 1 },
  { label: 'Ansioso', color: '#ff7300ff', score: 2 },
  { label: 'Envergonhado', color: '#d3559aff', score: 2 },
  { label: 'Péssimo', color: '#0e005aff', score: 1 },
  { label: 'Cansado', color: '#202020ff', score: 2 },
  { label: 'Animado', color: '#32CD32', score: 4 },
];

// --- Helpers para organizar os dados ---

function getWeekData(data) {
  const week = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const result = EMOTIONS.map(() => Array(7).fill(0));

  data.forEach((entry) => {
    const d = new Date(entry.date);
    const dayIndex = d.getDay();
    entry.moods.forEach((m) => {
      const idx = EMOTIONS.findIndex((e) => e.label === m);
      if (idx !== -1) {
        result[idx][dayIndex] += 1;
      }
    });
  });

  return {
    labels: week,
    legend: EMOTIONS.map(e => e.label),
    data: week.map((_, i) => EMOTIONS.map((_, j) => result[j][i])),
    barColors: EMOTIONS.map(e => e.color),
  };
}

function getMonthData(data) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const result = EMOTIONS.map(() => Array(daysInMonth).fill(0));

  // Filtrar apenas dados do mês atual
  const currentMonthData = data.filter((entry) => {
    const d = new Date(entry.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  currentMonthData.forEach((entry) => {
    const d = new Date(entry.date);
    const dayIndex = d.getDate() - 1;
    if (dayIndex >= 0 && dayIndex < daysInMonth) {
      entry.moods.forEach((m) => {
        const idx = EMOTIONS.findIndex((e) => e.label === m);
        if (idx !== -1) {
          result[idx][dayIndex] += 1;
        }
      });
    }
  });

  // Gerar labels mostrando apenas alguns dias para não ficar muito poluído
  const labels = Array(daysInMonth).fill('').map((_, i) => {
    const interval = Math.max(Math.floor(daysInMonth / 7), 1);
    if (i % interval === 0 || i === daysInMonth - 1) {
      return (i + 1).toString();
    }
    return '';
  });

  return {
    labels,
    legend: EMOTIONS.map(e => e.label),
    data: labels.map((_, i) => EMOTIONS.map((_, j) => result[j][i])),
    barColors: EMOTIONS.map(e => e.color),
  };
}

// Nova função para calcular estatísticas
function getStats(data) {
  if (!data.length) return { totalEntries: 0, avgMoodScore: 0, mostCommon: 'N/A', streak: 0 };

  const totalEntries = data.length;
  let totalScore = 0;
  let moodCount = {};
  
  data.forEach(entry => {
    entry.moods.forEach(mood => {
      const emotion = EMOTIONS.find(e => e.label === mood);
      if (emotion) {
        totalScore += emotion.score;
        moodCount[mood] = (moodCount[mood] || 0) + 1;
      }
    });
  });

  const totalMoods = Object.values(moodCount).reduce((a, b) => a + b, 0);
  const avgMoodScore = totalMoods > 0 ? (totalScore / totalMoods).toFixed(1) : 0;
  
  const mostCommon = Object.keys(moodCount).reduce((a, b) => 
    moodCount[a] > moodCount[b] ? a : b, Object.keys(moodCount)[0] || 'N/A'
  );

  // Calcular streak de dias consecutivos
  const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedData.length; i++) {
    const entryDate = new Date(sortedData[i].date);
    entryDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === i) {
      streak++;
    } else {
      break;
    }
  }

  return { totalEntries, avgMoodScore, mostCommon, streak };
}

// Nova função para gráfico de linha da média semanal
function getWeeklyTrendData(data) {
  const weeklyAverages = [];
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  if (sortedData.length === 0) return { labels: [], datasets: [{ data: [] }] };

  const weeks = {};
  
  sortedData.forEach(entry => {
    const date = new Date(entry.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = { scores: [], count: 0 };
    }
    
    entry.moods.forEach(mood => {
      const emotion = EMOTIONS.find(e => e.label === mood);
      if (emotion) {
        weeks[weekKey].scores.push(emotion.score);
        weeks[weekKey].count++;
      }
    });
  });

  const weekKeys = Object.keys(weeks).sort().slice(-8); // Últimas 8 semanas
  
  return {
    labels: weekKeys.map(key => {
      const date = new Date(key);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [{
      data: weekKeys.map(key => {
        const week = weeks[key];
        return week.scores.length > 0 
          ? week.scores.reduce((a, b) => a + b, 0) / week.scores.length 
          : 0;
      }),
      color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
      strokeWidth: 3
    }]
  };
}

// --- Tela principal ---

function DashboardScreen({ navigation }) {
  const { theme } = React.useContext(ThemeContext);
  const [data, setData] = useState([]);
  const [view, setView] = useState('week');
  const [chartType, setChartType] = useState('bar'); // 'bar' ou 'trend'

  useEffect(() => {
    (async () => {
      let d = await AsyncStorage.getItem('moodData');
      d = d ? JSON.parse(d) : [];
      setData(d);
    })();
  }, []);

  const weekData = getWeekData(data);
  const monthData = getMonthData(data);
  const stats = getStats(data);
  const trendData = getWeeklyTrendData(data);

  const chartHeight = view === 'week' ? screenHeight * 0.35 : screenHeight * 0.4;
  const weekChartWidth = screenWidth * 1.2;
  const monthChartWidth = screenWidth * 2;

  return (
    <ImageBackground source={theme.image} style={{ flex: 1 }} resizeMode="cover">
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.backButton }]}
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-left" size={38} color={theme.text} />
      </TouchableOpacity>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
        <AppText style={[styles.title, { color: theme.text }]}>Dashboard</AppText>
        
        {/* Cards de Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <AppText style={[styles.statNumber, { color: theme.text }]}>{stats.totalEntries}</AppText>
            <AppText style={[styles.statLabel, { color: theme.textSecondary }]}>Registros</AppText>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <AppText style={[styles.statNumber, { color: theme.text }]}>{stats.avgMoodScore}</AppText>
            <AppText style={[styles.statLabel, { color: theme.textSecondary }]}>Média</AppText>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <AppText style={[styles.statNumber, { color: theme.text }]}>{stats.streak}</AppText>
            <AppText style={[styles.statLabel, { color: theme.textSecondary }]}>Sequência</AppText>
          </View>
        </View>

        {/* Emoção mais frequente */}
        <View style={[styles.frequentMoodCard, { backgroundColor: theme.card }]}>
          <Icon name="trending-up" size={24} color={theme.text} style={{ marginRight: 10 }} />
          <View>
            <AppText style={[styles.frequentMoodTitle, { color: theme.text }]}>Humor mais frequente</AppText>
            <AppText style={[styles.frequentMoodText, { color: theme.textSecondary }]}>{stats.mostCommon}</AppText>
          </View>
        </View>

        {/* Toggle para tipo de gráfico */}
        <View style={styles.chartTypeRow}>
          <TouchableOpacity onPress={() => setChartType('bar')}>
            <View style={[styles.chartTypeButton, chartType === 'bar' && styles.chartTypeSelected]}>
              <Icon name="bar-chart-2" size={20} color={chartType === 'bar' ? '#fff' : theme.text} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setChartType('trend')}>
            <View style={[styles.chartTypeButton, chartType === 'trend' && styles.chartTypeSelected]}>
              <Icon name="trending-up" size={20} color={chartType === 'trend' ? '#fff' : theme.text} />
            </View>
          </TouchableOpacity>
        </View>

        {chartType === 'bar' ? (
          <>
            <View style={styles.toggleRow}>
              <TouchableOpacity onPress={() => setView('week')}>
                <AppText
                  style={[
                    styles.toggle,
                    view === 'week' && styles.selected,
                    { borderColor: theme.text, color: theme.text },
                  ]}
                >
                  Semana
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setView('month')}>
                <AppText
                  style={[
                    styles.toggle,
                    view === 'month' && styles.selected,
                    { borderColor: theme.text, color: theme.text },
                  ]}
                >
                  Mês
                </AppText>
              </TouchableOpacity>
            </View>

            {view === 'month' ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
                <View style={{ alignItems: 'center', width: monthChartWidth }}>
                  <StackedBarChart
                    data={monthData}
                    width={monthChartWidth}
                    height={chartHeight}
                    chartConfig={{
                      backgroundColor: theme.card,
                      backgroundGradientFrom: theme.card,
                      backgroundGradientTo: theme.card,
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                      labelColor: () => theme.textSecondary,
                      propsForBackgroundLines: { stroke: 'transparent' },
                    }}
                    style={{ marginVertical: 8, borderRadius: 18 }}
                    hideLegend={false}
                    fromZero
                  />
                </View>
              </ScrollView>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
                <View style={{ alignItems: 'center', width: weekChartWidth }}>
                  <StackedBarChart
                    data={weekData}
                    width={weekChartWidth}
                    height={chartHeight}
                    chartConfig={{
                      backgroundColor: theme.card,
                      backgroundGradientFrom: theme.card,
                      backgroundGradientTo: theme.card,
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                      labelColor: () => theme.textSecondary,
                      propsForBackgroundLines: { stroke: 'transparent' },
                    }}
                    style={{ marginVertical: 8, borderRadius: 18 }}
                    hideLegend={false}
                    fromZero
                  />
                </View>
              </ScrollView>
            )}
          </>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <AppText style={[styles.chartTitle, { color: theme.text }]}>Tendência do Humor (8 semanas)</AppText>
            <LineChart
              data={trendData}
              width={screenWidth}
              height={chartHeight}
              chartConfig={{
                backgroundColor: theme.card,
                backgroundGradientFrom: theme.card,
                backgroundGradientTo: theme.card,
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                labelColor: () => theme.textSecondary,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726"
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>
        )}

        {/* Resumo semanal */}
        {data.length > 0 && (
          <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
            <AppText style={[styles.summaryTitle, { color: theme.text }]}>Resumo da Semana</AppText>
            <AppText style={[styles.summaryText, { color: theme.textSecondary }]}>
              Você registrou {data.filter(entry => {
                const entryDate = new Date(entry.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return entryDate >= weekAgo;
              }).length} humores nos últimos 7 dias.
            </AppText>
          </View>
        )}

        <AppText style={[styles.subtitle, { color: theme.text }]}>Registros recentes:</AppText>
        {data.slice(-7).reverse().map((entry, idx) => (
          <View key={idx} style={[styles.entry, { backgroundColor: theme.card }]}>
            <View style={styles.entryHeader}>
              <AppText style={[styles.entryDate, { color: theme.text }]}>
                {new Date(entry.date).toLocaleDateString('pt-BR', { 
                  weekday: 'short', 
                  day: '2-digit', 
                  month: '2-digit' 
                })}
              </AppText>
              <View style={styles.moodIndicators}>
                {entry.moods.slice(0, 3).map((mood, moodIdx) => {
                  const emotion = EMOTIONS.find(e => e.label === mood);
                  return (
                    <View 
                      key={moodIdx}
                      style={[styles.moodDot, { backgroundColor: emotion?.color || '#ccc' }]}
                    />
                  );
                })}
                {entry.moods.length > 3 && (
                  <AppText style={[styles.moreIndicator, { color: theme.textSecondary }]}>
                    +{entry.moods.length - 3}
                  </AppText>
                )}
              </View>
            </View>
            <AppText style={[styles.entryMoods, { color: theme.textSecondary }]}>
              {entry.moods.join(', ')}
            </AppText>
            {entry.note && (
              <AppText style={[styles.entryNote, { color: theme.textSecondary }]}>
                "{entry.note}"
              </AppText>
            )}
          </View>
        ))}

        {data.length === 0 && (
          <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
            <Icon name="bar-chart" size={48} color={theme.textSecondary} />
            <AppText style={[styles.emptyTitle, { color: theme.text }]}>Nenhum registro ainda</AppText>
            <AppText style={[styles.emptyText, { color: theme.textSecondary }]}>
              Comece registrando seus humores para ver estatísticas aqui!
            </AppText>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 60,
    paddingHorizontal: 10,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    marginBottom: 20,
    alignSelf: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  statNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Poppins',
    fontSize: 12,
    textAlign: 'center',
  },
  frequentMoodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  frequentMoodTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  frequentMoodText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    marginTop: 2,
  },
  chartTypeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 15,
  },
  chartTypeButton: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5c6082',
  },
  chartTypeSelected: {
    backgroundColor: '#5c6082',
  },
  chartTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 20,
  },
  toggle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 10,
  },
  selected: {
    backgroundColor: '#5c6082',
    color: '#fff',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  summaryTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    marginBottom: 8,
  },
  summaryText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    lineHeight: 20,
  },
  subtitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
  },
  entry: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  moodIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moodDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  moreIndicator: {
    fontFamily: 'Poppins',
    fontSize: 12,
    marginLeft: 4,
  },
  entryMoods: {
    marginBottom: 6,
    fontFamily: 'Poppins',
    fontSize: 14,
  },
  entryNote: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    marginTop: 20,
  },
  emptyTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
    borderRadius: 30,
    padding: 8,
  },
});