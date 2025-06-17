import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width - 20;

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

export default function DashboardScreen({ navigation }) {
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

  // Ajustar altura e largura do gráfico para o mês (mais dados = mais altura e largura)
  const chartHeight = view === 'week' ? 220 : 320;
  const weekChartWidth = screenWidth;
  const monthChartWidth = 1600;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity onPress={() => setView('week')}>
          <Text style={[styles.toggle, view === 'week' && styles.selected]}>Semana</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setView('month')}>
          <Text style={[styles.toggle, view === 'month' && styles.selected]}>Mês</Text>
        </TouchableOpacity>
      </View>
      {view === 'month' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ alignItems: 'center' }}>
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
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(46, 25, 46, ${opacity})`,
                labelColor: () => '#2e192e',
                style: { borderRadius: 16 },
                propsForLabels: { fontSize: 10 },
                propsForVerticalLabels: { fontSize: 10 },
              }}
              style={{ marginVertical: 8, borderRadius: 16, alignSelf: 'center' }}
              showValuesOnTopOfBars={true}
              fromZero={true}
              withInnerLines={false}
            />
          </View>
        </ScrollView>
      ) : (
        <View style={{ alignItems: 'center', width: '100%', marginLeft: -20 }}>
          <BarChart
            data={{
              labels: weekData.labels,
              datasets: [{ data: weekData.data }],
            }}
            width={weekChartWidth}
            height={chartHeight}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(46, 25, 46, ${opacity})`,
              labelColor: () => '#2e192e',
              style: { borderRadius: 16 },
              propsForLabels: { fontSize: 10 },
              propsForVerticalLabels: { fontSize: 10 },
            }}
            style={{ marginVertical: 8, borderRadius: 16, alignSelf: 'center' }}
            showValuesOnTopOfBars={true}
            fromZero={true}
            withInnerLines={false}
          />
        </View>
      )}
      <Text style={styles.subtitle}>Registros recentes:</Text>
      {data.slice(-7).reverse().map((entry, idx) => (
        <View key={idx} style={styles.entry}>
          <Text style={styles.entryDate}>{entry.date}</Text>
          <Text style={styles.entryMoods}>{entry.moods.join(', ')}</Text>
          <Text style={styles.entryNote}>{entry.note}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MoodTransition')}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      <View style={styles.organicShape1} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#2e192e',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2e192e',
    marginHorizontal: 10,
  },
  selected: {
    backgroundColor: '#2e192e',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#2e192e',
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
    color: '#2e192e',
    marginBottom: 4,
  },
  entryNote: {
    color: '#444',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#2e192e',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 20,
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
    backgroundColor: '#2e192e',
    borderRadius: 200,
    opacity: 0.08,
    zIndex: 0,
  },
});
