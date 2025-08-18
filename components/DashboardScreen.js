import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import AppText from './AppText';
import { ThemeContext } from './ThemeContext';
import Icon from 'react-native-vector-icons/Feather';

const screenWidth = Dimensions.get('window').width - 20;
const screenHeight = Dimensions.get('window').height;

function getWeekData(data) {
  // Agrupa por dia da semana
  const week = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const result = [0, 0, 0, 0, 0, 0, 0];
  data.forEach((entry) => {
    const d = new Date(entry.date);
    result[d.getDay()] += entry.moods.length;
  });
  return { labels: week, data: result };
}

function getMonthData(data) {
  // Agrupa por dia do mês
  const days = Array(31).fill(0);
  data.forEach((entry) => {
    const d = new Date(entry.date);
    days[d.getDate() - 1] += entry.moods.length;
  });
  // Para responsividade, mostrar só alguns labels (ex: 1, 5, 10, 15, 20, 25, 30)
  const labels = days.map((_, i) => {
    if ([0, 4, 9, 14, 19, 24, 29].includes(i)) return (i + 1).toString();
    return '';
  });
  return {
    labels,
    data: days,
  };
}

function DashboardScreen({ navigation }) {
  const { theme } = React.useContext(ThemeContext);
  const [data, setData] = useState([]);
  const [view, setView] = useState('week');

  useEffect(() => {
    (async () => {
      let d = await AsyncStorage.getItem('moodData');
      d = d ? JSON.parse(d) : [];
      setData(d);
    })();
  }, []);

  const weekData = getWeekData(data);
  const monthData = getMonthData(data);

  const chartHeight = view === 'week' ? screenHeight * 0.3 : screenHeight * 0.4;
  const weekChartWidth = screenWidth;
  const monthChartWidth = screenWidth * 2;

  return (
    <ImageBackground source={theme.image} style={{ flex: 1 }} resizeMode="cover">
      <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.backButton }]} onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={38} color={theme.text} />
      </TouchableOpacity>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
        <AppText style={[styles.title, { color: theme.text }]}>Dashboard</AppText>
        <View style={styles.toggleRow}>
          <TouchableOpacity onPress={() => setView('week')}>
            <AppText style={[styles.toggle, view === 'week' && styles.selected, { borderColor: theme.text, color: theme.text }]}>Semana</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setView('month')}>
            <AppText style={[styles.toggle, view === 'month' && styles.selected, { borderColor: theme.text, color: theme.text }]}>Mês</AppText>
          </TouchableOpacity>
        </View>
        {view === 'month' ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
            <View style={{ alignItems: 'center', width: monthChartWidth }}>
              <BarChart
                data={{
                  labels: monthData.labels,
                  datasets: [{ data: monthData.data }],
                }}
                width={monthChartWidth}
                height={chartHeight}
                yAxisLabel=""
                chartConfig={{
                  backgroundColor: theme.card,
                  backgroundGradientFrom: theme.card,
                  backgroundGradientTo: theme.card,
                  decimalPlaces: 0,
                  color: (opacity = 1) => theme.text,
                  labelColor: () => theme.textSecondary,
                  style: { borderRadius: 18 },
                  propsForLabels: { fontSize: 13, fontWeight: 'bold' },
                  propsForVerticalLabels: { fontSize: 13, fontWeight: 'bold' },
                  barPercentage: 0.5,
                  propsForBackgroundLines: { stroke: 'transparent' },
                }}
                style={{ marginVertical: 8, borderRadius: 18, alignSelf: 'center', shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 3 }}
                showValuesOnTopOfBars={true}
                fromZero={true}
                withInnerLines={false}
              />
            </View>
          </ScrollView>
        ) : (
          <View style={{ alignItems: 'center', width: '100%' }}>
            <BarChart
              data={{
                labels: weekData.labels,
                datasets: [{ data: weekData.data }],
              }}
              width={weekChartWidth}
              height={chartHeight}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: theme.card,
                backgroundGradientFrom: theme.card,
                backgroundGradientTo: theme.card,
                decimalPlaces: 0,
                color: (opacity = 1) => theme.text,
                labelColor: () => theme.textSecondary,
                style: { borderRadius: 18 },
                propsForLabels: { fontSize: 13, fontWeight: 'bold' },
                propsForVerticalLabels: { fontSize: 13, fontWeight: 'bold' },
                barPercentage: 0.5,
                propsForBackgroundLines: { stroke: 'transparent' },
              }}
              style={{ marginVertical: 8, borderRadius: 18, alignSelf: 'center', shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 3 }}
              showValuesOnTopOfBars={true}
              fromZero={true}
              withInnerLines={false}
            />
          </View>
        )}
        <AppText style={[styles.subtitle, { color: theme.text }]}>Registros recentes:</AppText>
        {data.slice(-7).reverse().map((entry, idx) => (
          <View key={idx} style={[styles.entry, { backgroundColor: theme.card }]}>
            <AppText style={[styles.entryDate, { color: theme.text }]}>{entry.date}</AppText>
            <AppText style={[styles.entryMoods, { color: theme.textSecondary }]}>{entry.moods.join(', ')}</AppText>
            <AppText style={[styles.entryNote, { color: theme.textSecondary }]}>{entry.note}</AppText>
          </View>
        ))}
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
    position: 'relative',
  },
  title: {
    fontSize: 28,
    color: '#2e192e',
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 20,
    zIndex: 10,
    elevation: 10,
  },
  toggle: {
    fontSize: 18,
    color: '#5c6082',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#5c6082',
    marginHorizontal: 10,
  },
  selected: {
    backgroundColor: '#5c6082',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#5c6082',
    marginTop: 20,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  entry: {
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  entryDate: {
    color: '#2e192e',
    fontWeight: 'bold',
  },
  entryMoods: {
    color: '#5c6082',
    marginBottom: 4,
  },
  entryNote: {
    color: '#444',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#5c6082',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: -20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  organicShape1: {
    position: 'absolute',
    top: -100,
    right: -120,
    width: 300,
    height: 300,
    backgroundColor: '#5c6082',
    borderRadius: 200,
    opacity: 0.08,
    zIndex: 0,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 30,
    padding: 8,
    elevation: 4,
  },
  backIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});
