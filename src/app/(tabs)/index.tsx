import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Vibration,
  Easing,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { ScoreContext } from '../(auth)/scorecontext';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

interface Habit {
  name: string;
  completed: boolean;
  score: string;
}

const EXERCISE_QUEUE: Record<string, Habit[]> = {
  day1: [
    { name: "(FOREARM + BICEPS) x JAWLINE", completed: false, score: "8" },
    { name: "LEG", completed: false, score: "8" },
    { name: "Full Stretch (10)/pelvic ", completed: false, score: "3" },
  ],
  day2: [
    { name: "CHEST (JAWLINE)", completed: false, score: "6" },
    { name: "HARD YOGA (10)/pelvic ", completed: false, score: "3" },
    { name: "ABS", completed: false, score: "10" },
  ],
  day3: [{ name: "*REST", completed: false, score: "15" }],
  day4: [
    { name: "HARD YOGA (10)", completed: false, score: "5" },
    { name: "*LEG", completed: false, score: "11" },
    { name: "Full Stretch (10)/pelvic ", completed: false, score: "3" },
  ],
  day5: [
    { name: "*CHEST (JAWLINE)", completed: false, score: "9" },
    { name: "HARD YOGA (10)/pelvic ", completed: false, score: "5" },
    { name: "(FOREARM + BICEPS) x JAWLINE", completed: false, score: "5" },
  ],
  day6: [{ name: "*REST , pelvic ", completed: false, score: "19" }],
  day7: [
    { name: "(FOREARM + BICEPS) x JAWLINE", completed: false, score: "8" },
    { name: "*ABS", completed: false, score: "11" },
  ],
};

const HABITS: Record<string, Habit[]> = {
  study: [
    { name: "1.30 hours", completed: false, score: "3" },
    { name: "3.00 hours", completed: false, score: "6" },
    { name: "4.30 hours", completed: false, score: "12" },
    { name: "6.00 hours", completed: false, score: "15" },
  ],
  croxess: [
    { name: "1.00 hours", completed: false, score: "3" },
    { name: "2.00 hours", completed: false, score: "6" },
    { name: "3.00 hours", completed: false, score: "12" },
    { name: "4.00 hours", completed: false, score: "15" },
  ],
};

const GLA = [
  "DA : ", "CA : ",
];

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Record<string, Habit[]>>(HABITS);
   const [TimeSpent, setTimeSpent] = useState<number[]>(new Array(GLA.length).fill(0));
  const [exerciseQueue, setExerciseQueue] = useState<Habit[]>([]);
  const [rewardVisible, setRewardVisible] = useState(false);
   const [startTimes, setStartTimes] = useState<number[]>(new Array(GLA.length).fill(0));
     const [dcState, setdcState] = useState<boolean[]>(new Array(GLA.length).fill(false));
     const [animations, setAnimations] = useState<Animated.Value[]>([]);
     

  

  useEffect(() => {
    const initializeState = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const storedHabits = await AsyncStorage.getItem("habit_tracker_habits");
        const storedExerciseQueue = await AsyncStorage.getItem(
          "habit_tracker_exercise_queue"
        );
        const lastUpdated = await AsyncStorage.getItem("habit_tracker_last_updated");

        if (storedHabits) setHabits(JSON.parse(storedHabits));

        if (lastUpdated !== today) {
          const currentDayKey =
            Object.keys(EXERCISE_QUEUE).find(
              (key) => JSON.stringify(EXERCISE_QUEUE[key]) === storedExerciseQueue
            ) || "day1";

          const isCurrentDayComplete = exerciseQueue.every((exercise) => exercise.completed);

          if (isCurrentDayComplete) {
            const nextDayKey =
              currentDayKey === "day7"
                ? "day1"
                : `day${parseInt(currentDayKey.replace("day", "")) + 1}`;
            setExerciseQueue(EXERCISE_QUEUE[nextDayKey]);
          } else {
            setExerciseQueue(JSON.parse(storedExerciseQueue || "[]"));
          }

          setHabits(HABITS);
          await AsyncStorage.setItem("habit_tracker_last_updated", today);
        } else {
          setExerciseQueue(
            JSON.parse(storedExerciseQueue || JSON.stringify(EXERCISE_QUEUE.day1))
          );
        }
      } catch (error) {
        console.error("Error initializing state: ", error);
      }
    };

    initializeState();
  }, []);

  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem("habit_tracker_habits", JSON.stringify(habits));
        await AsyncStorage.setItem(
          "habit_tracker_exercise_queue",
          JSON.stringify(exerciseQueue)
        );
      } catch (error) {
        console.error("Error saving state: ", error);
      }
    };
    saveState();

    const allCompleted =
      Object.values(habits).flat().every((habit) => habit.completed) &&
      exerciseQueue.every((exercise) => exercise.completed);
    setRewardVisible(allCompleted);
  }, [habits, exerciseQueue]);

  const handleHabitClick = (category: string, index: number) => {
    setHabits((prev) => {
      const updated = { ...prev };
      updated[category][index].completed = !updated[category][index].completed;
      if (updated[category][index].completed) {
        setScore(score + Number(updated[category][index].score));
        Vibration.vibrate(500);
      }
      return updated;
    });
  };

  const handleExerciseClick = (index: number) => {
    setExerciseQueue((prev) => {
      const updated = [...prev];
      updated[index].completed = !updated[index].completed;
      if (updated[index].completed) {
        setScore(score + parseInt(updated[index].score));
        Vibration.vibrate(500);
      }
      return updated;
    });
  };

  const renderButtons = (items: Habit[], onClick: (index: number) => void) => {
    return items.map((item, index) => (
      <TouchableOpacity
        key={item.name}
        style={[
          styles.button,
          item.completed ? styles.completedButton : {},
        ]}
        onPress={() => onClick(index)}
      >
        <Text style={styles.buttonText}>{item.name}</Text>
      </TouchableOpacity>
    ));
  };

  const interpolateColor = (percentage, startColor, endColor) => {
    const startRGB = startColor.match(/\w\w/g).map((hex) => parseInt(hex, 16));
    const endRGB = endColor.match(/\w\w/g).map((hex) => parseInt(hex, 16));
  
    const interpolatedRGB = startRGB.map((start, i) => {
      const end = endRGB[i];
      return Math.round(start + (end - start) * percentage).toString(16).padStart(2, '0');
    });
  
    return `#${interpolatedRGB.join('')}`;
  };
  
  const getGradientColors = (value) => {
    const clampedValue = Math.min(240, Math.max(0, value));
    const ratio = clampedValue / 240;
  
    if (ratio <= 0.5) {
      // Interpolate from Red to Yellow (0 - 120)
      const segmentRatio = ratio / 0.5;
      const startColor = '#E90E00'; // Red
      const endColor = '#FFFF00'; // Yellow
      const color = interpolateColor(segmentRatio, startColor, endColor);
      return ['#E90E00', color, '#FFFF00'];
    } else {
      // Interpolate from Yellow to Green (120 - 240)
      const segmentRatio = (ratio - 0.5) / 0.5;
      const startColor = '#FFFF00'; // Yellow
      const endColor = '#00FF00'; // Green
      const color = interpolateColor(segmentRatio, startColor, endColor);
      return ['#FFFF00', color, '#00FF00'];
    }
  };

  const handlePress = (index: number) => {
    const currentTime = Date.now();
  
    const updatedStartTimes = [...startTimes];
    if (startTimes[index] === 0) {
      // Button turned "on"
      Vibration.vibrate(500);
      updatedStartTimes[index] = currentTime;
    } else {
      // Button turned "off"
      const elapsedTime = currentTime - startTimes[index];
      updatedStartTimes[index] = 0; // Reset start time
      const updatedNegativeTimeSpent = [...TimeSpent];
      updatedNegativeTimeSpent[index] += Math.round(elapsedTime / 1000);
      setTimeSpent(updatedNegativeTimeSpent);
      AsyncStorage.setItem("dctimespent", JSON.stringify(updatedNegativeTimeSpent));
      
    }
  
    AsyncStorage.setItem("startTimes", JSON.stringify(updatedStartTimes));
    setStartTimes(updatedStartTimes);
  
    const updatedState = [...dcState];
    updatedState[index] = !updatedState[index];
    setdcState(updatedState);
    AsyncStorage.setItem("dcState", JSON.stringify(updatedState));
  
   
  
  };

   useEffect(() => {
    
      const createAnimations = () => {
        const totalButtons = GLA.length ;
        const anims = Array.from({ length: totalButtons }, () => new Animated.Value(0));
        setAnimations(anims);
  
        anims.forEach((anim) => startFloatingAnimation(anim));
      };
  
      
      createAnimations();
    }, []);

    useEffect(() => {
      const checkReset = async () => {
        try {
          const today = new Date().toDateString();
          const lastResetDate = await AsyncStorage.getItem("dcplastResetDate");
          console.log("Last Reset Date:", lastResetDate);
      
          if (lastResetDate !== today) {
            // Reset states if the date has changed
            console.log("Resetting states for the new day.");
            await AsyncStorage.setItem("dcState", JSON.stringify(new Array(GLA.length).fill(false)));
            await AsyncStorage.setItem("dctimespent", JSON.stringify(new Array(GLA.length).fill(0)));
            await AsyncStorage.setItem("startTimes", JSON.stringify(new Array(GLA.length).fill(0)));
            await AsyncStorage.setItem("dcplastResetDate", today);
      
            setdcState(new Array(GLA.length).fill(false));
            setTimeSpent(new Array(GLA.length).fill(0));
           
          } else {
          
            const savedState = await AsyncStorage.getItem("dcState");
           
            const savedTimeSpent = await AsyncStorage.getItem("dctimespent");

            const savedstarttimes = await AsyncStorage.getItem("startTimes");

            
      
            if (savedState) setdcState(JSON.parse(savedState));
            if (savedTimeSpent) setTimeSpent(JSON.parse(savedTimeSpent));
            if (savedstarttimes) setStartTimes(JSON.parse(savedstarttimes));
        
          }
        } catch (error) {
          console.error("Error checking reset:", error);
        }
      };
    
      checkReset();
     
    }, []);

    const startFloatingAnimation = (anim: Animated.Value) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 2000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      const scoreContext = useContext(ScoreContext);
  if (!scoreContext) {
    throw new Error("ScoreContext must be used within a ScoreProvider");
  }
  const { score, setScore } = scoreContext;
    
  

  return (
    <View style={styles.mainContainer}>
      {/* Top 3/4 Section */}
      <View style={styles.topSection}>
        <ScrollView contentContainerStyle={styles.container}>
          <AntDesign  style={styles.title} name="key" size={40} color="white" />
          <View style={styles.grid}>{renderButtons(habits.study, (i) => handleHabitClick("study", i))}</View>
  
          <Entypo style={styles.title} name="credit" size={40} color="white" />
          <View style={styles.grid}>{renderButtons(habits.croxess, (i) => handleHabitClick("croxess", i))}</View>
  
          <AntDesign  style={styles.title} name="rocket1" size={40} color="white" />
        
          <View style={styles.grid}>{renderButtons(exerciseQueue, handleExerciseClick)}</View>
  
          {rewardVisible && (
            <TouchableOpacity style={styles.rewardButton} onPress={() => setHabits(HABITS)}>
              <Text style={styles.rewardText}>Y E S</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
  
     

      <View style={styles.additionalContent}>
                <Text style={styles.columnTitle}></Text>
                {GLA.map((behavior, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      transform: [
                        {
                          translateY: animations[index]?.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-5, 5],
                          }) || 0,
                        },
                      ],
                    }}
                  >
                    <LinearGradient colors={getGradientColors( (TimeSpent[index])/60 )} style={styles.gradients}>
                  
                      <TouchableOpacity
                        style={[
                          styles.buttons,
                          dcState[index] ? styles.negativeButtonActive : styles.negativeButton,
                        ]}
                        onPress={() => handlePress(index)}
                      >
                        <Text style={styles.buttonTextt}>{behavior +  Math.round( (TimeSpent[index])/60  ) }</Text>
                      
                      </TouchableOpacity>
                    </LinearGradient>
                  </Animated.View>
                ))}
               
              </View>

    </View>
  ) };
  
  // Updated Styles
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 0.95,
      backgroundColor: "#000000",
    },
    topSection: {
      flex: 3,
    },
    bottomSection: {
      flex: 1,
      backgroundColor: "#202020",
      justifyContent: "center",
   
      alignItems: "center",
      padding: 16,
    },
    additionalContent: {
      color: "white",
      fontSize: 16,
      textAlign: "center",
      backgroundColor:"black",
     borderRadius:100,
    },
    container: {
      padding: 16,
    },
    title: {
      fontSize: 48,
      fontWeight: "bold",
      marginVertical: 8,
      paddingLeft:140,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    button: {
      width: 130,
      height: 80,
      borderRadius: 40,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      margin: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    buttonText: {
      color: "black",
      fontWeight: "bold",
      textAlign: "center",
    },
    completedButton: {
      backgroundColor: "#32CD32",
    },
    rewardButton: {
      backgroundColor: "#FFD700",
      padding: 16,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    rewardText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    columnContainer: { flex: 1, alignItems: "center", },
  columnTitle: { fontSize: 10, fontWeight: "bold", color: "#FFD700"},
  buttons: {
    width:200,
    height: 60,
    marginLeft:0,
    borderRadius: 160,
    justifyContent: "center",

    marginBottom: 5,
    elevation: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  negativeButton: {  },
  negativeButtonActive: {backgroundColor: "#32CD32" , },
  positiveButton: {  },
  positiveButtonActive: { backgroundColor: "#32CD32" },
  buttonTexts: { fontSize: 20, fontWeight: "bold", color: "black", textAlign: "center" ,     alignItems: "flex-start",
    marginRight:0,marginBottom: 7, },
  rewardTexts: { fontSize: 18, fontWeight: "bold", color: "#FFD700", marginTop: 10 },
  gradients: {
    width:200,
    height:60,
    marginLeft:84,
    marginBottom:5,
    padding: 0,
    borderRadius: 160,
    shadowColor: "#3C20FB",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 200,
  },
  buttonTextt: { fontSize: 24,
    fontFamily: "revert",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textTransform: "uppercase",
    textShadowColor: "rgba(255, 234, 6, 0.75)", // Glowing color (e.g., green)
    textShadowOffset: { width: 0, height: 0 }, // Offset of the shadow
    textShadowRadius: 6, },
  });
  


export default HabitTracker;
