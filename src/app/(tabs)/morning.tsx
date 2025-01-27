import React, { useState, useEffect , useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { ScoreContext } from '../(auth)/scorecontext';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
const habits = [
  '4:00 A.M - UNEXIST --> Now  ',
  'ICE BATH',
  '*C',
  'WHOLE VIBRE(5) - liberate',
  'WIMHOFF /SBV / Mosq ',
  '*BRAIN APPLE , SPIRAL(15)',
  '*DRILL Initiate() ',
  '*Run - HIIT - 15s X 5 , carry band squat (*20 * 3) - scan , heart , breath',
  'Croxess - eyefocus(10)',
  'shower - unexist - IN THE NOW - SBV',
  '8:50 P.M -  final traverse  ( ult defy ) --> Plast',
];

const STORAGE_KEY = 'HabitsCompletion';
const LAST_INDEX_KEY = 'LastSwiperIndex';



const MoriningApp = () => {
  const [completedHabits, setCompletedHabits] = useState<Record<number, boolean>>({});
  const [swiperRef, setSwiperRef] = useState<Swiper | null>(null);

  useEffect(() => {
    loadLastIndex();
    loadCompletionState();
    resetAtMidnight();
  }, []);
  
  const loadLastIndex = async () => {
    try {
      const storedIndex = await AsyncStorage.getItem(LAST_INDEX_KEY);
      if (storedIndex !== null) {
        swiperRef?.scrollBy(parseInt(storedIndex, 10));
      }
    } catch (error) {
      console.error('Error loading last swiper index:', error);
    }
  };

  


  const loadCompletionState = async () => {
    try {
      const storedState = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedState) {
        setCompletedHabits(JSON.parse(storedState));
      }
    } catch (error) {
      console.error('Error loading completion state:', error);
    }
  };

  const saveCompletionState = async (state: Record<number, boolean>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving completion state:', error);
    }
  };

  const resetCompletionState = async () => {
    setCompletedHabits({});
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const resetAtMidnight = () => {
    const now = moment();
    const midnight = moment().endOf('day');
    const timeout = midnight.diff(now) + 1000; // Add a buffer of 1 second

    setTimeout(async () => {
      await resetCompletionState();
      Alert.alert('Daily Reset', 'Your habits have been reset for the new day!');
      resetAtMidnight(); // Schedule the next reset
    }, timeout);
  };

  const handleNext = (index: number) => {
    if(index===habits.length-1){
        setScore(score + 8)

    }
    const updatedHabits = { ...completedHabits, [index]: true };

    setCompletedHabits(updatedHabits);
    saveCompletionState(updatedHabits);

    if (swiperRef) {
      swiperRef.scrollBy(1); // Navigate to the next item
    }
  };

  
const scoreContext = useContext(ScoreContext);

if (!scoreContext) {
  throw new Error('ScoreContext must be used within a ScoreProvider');
}

const { score, setScore } = scoreContext;

  return (
    <Swiper
      loop={true}
      showsPagination={true}
      ref={(ref) => setSwiperRef(ref)}
    >
      {habits.map((habit, index) => (
        <View key={index} style={styles.slide}>
          <Text style={styles.habitText}>{habit}</Text>
          <TouchableOpacity
            style={[
              styles.button,
              completedHabits[index] && styles.buttonCompleted,
            ]}
            onPress={() => handleNext(index)}
          >
            <Text style={styles.buttonText}>
              {completedHabits[index] ? <AntDesign name="check" size={24} color="black" /> : <Feather name="chevrons-right" size={24} color="black" /> }
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  habitText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  button: {
    padding: 11,
    backgroundColor: '#007bff',
    borderRadius: 10,
    elevation: 2,
  },
  buttonCompleted: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default MoriningApp;
