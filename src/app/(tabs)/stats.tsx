import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { ScoreContext } from '../(auth)/scorecontext';

const StatisticsScreen = () => {
  const [dailyScores, setDailyScores] = useState<{ date: string; score: number }[]>([]);
  const [average, setAverage] = useState(0);
  const scoreContext = useContext(ScoreContext);
  if (!scoreContext) {
    throw new Error("ScoreContext must be used within a ScoreProvider");
  }
  const { score } = scoreContext;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const storedScores = await AsyncStorage.getItem('dailyScores');
        if (storedScores) {
          const parsedScores = JSON.parse(storedScores);
          setDailyScores(parsedScores);
          calculateAverage(parsedScores);
        }
      } catch (error) {
        console.error('Error fetching scores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  useEffect(() => {
    const saveScore = async () => {
      const today = new Date().toISOString().split('T')[0];
      if (!dailyScores.some((entry) => entry.date === today)) {
        const updatedScores = [...dailyScores, { date: today, score }];
        setDailyScores(updatedScores);
        calculateAverage(updatedScores);
        await AsyncStorage.setItem('dailyScores', JSON.stringify(updatedScores));
      }
    };
    saveScore();
  }, [score]);

  const calculateAverage = (scores: { date: string; score: number }[]) => {
    if (scores.length === 0) return;
    const total = scores.reduce((acc, curr) => acc + curr.score, 0);
    setAverage((total / scores.length).toFixed(2));
  };

  const chartData = {
    labels: dailyScores.length > 0 ? dailyScores.map((entry) => entry.date) : ['No Data'],
    datasets: [
      {
        data: dailyScores.length > 0 ? dailyScores.map((entry) => entry.score) : [0],
        color: () => '#ECF300',
        strokeWidth: 2,
      },
    ],
    legend: ['Daily Scores'],
  };


  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stats</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width * 0.95} // 90% of screen width
        height={500} // Increased chart height
        chartConfig={{
          backgroundColor: 'black',
          backgroundGradientFrom: 'black',
          backgroundGradientTo: 'black',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(236, 243, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ECF300',
          },
        }}
        style={styles.chart}
      />
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Avg: {average}</Text>
        <Text style={styles.summaryText}>High: {dailyScores.length > 0 ? Math.max(...dailyScores.map((entry) => entry.score)) : 'N/A'}</Text>
        <Text style={styles.summaryText}>Low: {dailyScores.length > 0 ? Math.min(...dailyScores.map((entry) => entry.score)) : 'N/A'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 22,
    color: '#ECF300',
    marginVertical: 20,
    fontWeight: 'bold',
  },
  chart: {
    borderRadius: 16,
  },
  summary: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  summaryText: {
    color: 'white',
    fontSize: 8,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default StatisticsScreen;
