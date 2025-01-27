import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { ScoreContext } from '../(auth)/scorecontext';

const NEGATIVE_BEHAVIORS = [
  "^ ^ ^ RIGHT NOW - miracle ✨ (not even a clue). ^ ^ ^  ",
  " ^    C O N S I S T E N C Y - STILLNESS - C L A R I T Y  - ENTITLEMENT - perverse in control - with pineal undisturbed (no up and downs) - Stay in Third eye - crucial onprocess custom plast   ^  ", 
  "   Delbaa expose pain , Tough bcz  ---> Purpose!   ",
  "   Unexist seeking existential Despa State Aware - Angerexprexion   ",
  "^ ^ ^  DRILL MAX --- IMMORTALITY PROJECT --- actualize adversity --->  perverxpression max to ----> (INDIFFERENT , UNEXIST , TRANSFERENCE , RICH , DESTROYED --AURAS) ^ ^ ^  ",
  "^  +++ENERGY - GENERATION - PACE - FLOW - something to look forward to (ex: initial minimilit time from void) - CHANNELIZATION - MANIFESTATION    ^ ",
  "  So That Incompletedness - Keep Enhancing The Abstract Till Death - Fight Reverse ",
  " ^ ^  NOW REVERSE GEAR - CHASING OPPOSITE FEEL - CHASING OTHERSIDE - Now Tough Choice -v become so good - IMMORTALITY  ^ ^  ",

  " EFFORT   ♻️   mini REWARDS ",
  " ^ ^ ^ AURA+++ ^ ^ ^ - ATTRACT SUCCESS - PASSIVE  ",
  "  Growing through going through - Without a why , With custom Props , Only Solving! 24 X 7  -   I   J U S T   H A P P E N  ",
  "    G R A T I T U D E    ",
  
];

const POSITIVE_BEHAVIORS = [
 
" ^ HELP ^  WITHOUT LIMITS - MANIFEST   ",
" out of Form , Time , Space , Emotions - Pure existence  ", 
" ^ ^ ^ L O V E  - UNEXISTENCE  ^ ^ ^ ",
"Grounded , Fun , Opportunities Aura Prop , ultimate real fun creature Transference ",
"Stimulations close - X desire  ", 
"Never Exist Delba happy , pleasure ---> Only Passive   ",
"conscious, entitle toward Future , Present ",
"PINEAL GLAND --> AWARENESS() - IMMORTALITY PROJECT - OVERWHELMINGNESS - ENERGY - attach part of hyper imagination layer - solve each fragments to the bigger one for ultimate liberation : ",




];

const BehaviorTracker: React.FC = () => {
  const [negativeState, setNegativeState] = useState<boolean[]>(new Array(NEGATIVE_BEHAVIORS.length).fill(false));
  const [positiveState, setPositiveState] = useState<boolean[]>(new Array(POSITIVE_BEHAVIORS.length).fill(false));
  const [negativeTimeSpent, setNegativeTimeSpent] = useState<number[]>(new Array(NEGATIVE_BEHAVIORS.length).fill(0));
  const [positiveTimeSpent, setPositiveTimeSpent] = useState<number[]>(new Array(POSITIVE_BEHAVIORS.length).fill(0));
  const [startTimes, setStartTimes] = useState<number[]>(new Array(NEGATIVE_BEHAVIORS.length + POSITIVE_BEHAVIORS.length).fill(0));

  const [animations, setAnimations] = useState<Animated.Value[]>([]);


  
  
  const saveState = async () => {
    try {

          const savedNegativeState = await AsyncStorage.getItem("negativeState");
          const savedPositiveState = await AsyncStorage.getItem("positiveState");
          const savedNegativeTimeSpent = await AsyncStorage.getItem("negativeTimeSpent");
          const savedPositiveTimeSpent = await AsyncStorage.getItem("positiveTimeSpent");
    
    
  
    
    } catch (error) {
      console.error("Error saving state:", error);
    }
  };

  
  useEffect(() => {
    const checkReset = async () => {
      try {
        const today = new Date().toDateString();
        const lastResetDate = await AsyncStorage.getItem("plastlastResetDate");
        console.log("Last Reset Date:", lastResetDate);
  
        if (lastResetDate !== today) {
          // Reset states if the date has changed
          console.log("Resetting states for the new day.");
          await AsyncStorage.setItem(
            "negativeState",
            JSON.stringify(new Array(NEGATIVE_BEHAVIORS.length).fill(false))
          );
          await AsyncStorage.setItem(
            "positiveState",
            JSON.stringify(new Array(POSITIVE_BEHAVIORS.length).fill(false))
          );
          await AsyncStorage.setItem("plastlastResetDate", today);
  
          setNegativeState(new Array(NEGATIVE_BEHAVIORS.length).fill(false));
          setPositiveState(new Array(POSITIVE_BEHAVIORS.length).fill(false));
          setNegativeTimeSpent(new Array(NEGATIVE_BEHAVIORS.length).fill(0));
          setPositiveTimeSpent(new Array(POSITIVE_BEHAVIORS.length).fill(0));
        } else {
          const savedNegativeState = await AsyncStorage.getItem("negativeState");
          const savedPositiveState = await AsyncStorage.getItem("positiveState");
          const savedNegativeTimeSpent = await AsyncStorage.getItem("negativeTimeSpent");
          const savedPositiveTimeSpent = await AsyncStorage.getItem("positiveTimeSpent");
  
          // Parse saved data or fallback to default values
          setNegativeState(
            savedNegativeState ? JSON.parse(savedNegativeState) : new Array(NEGATIVE_BEHAVIORS.length).fill(false)
          );
          setPositiveState(
            savedPositiveState ? JSON.parse(savedPositiveState) : new Array(POSITIVE_BEHAVIORS.length).fill(false)
          );
          setNegativeTimeSpent(
            savedNegativeTimeSpent
              ? JSON.parse(savedNegativeTimeSpent).map((time) => (isNaN(time) ? 0 : time))
              : new Array(NEGATIVE_BEHAVIORS.length).fill(0)
          );
          setPositiveTimeSpent(
            savedPositiveTimeSpent
              ? JSON.parse(savedPositiveTimeSpent).map((time) => (isNaN(time) ? 0 : time))
              : new Array(POSITIVE_BEHAVIORS.length).fill(0)
          );
        }
      } catch (error) {
        console.error("Error checking reset:", error);
      }
    };
  
    checkReset();
  }, []);
  
  
  useEffect(() => {
    saveState();
  }, [negativeState, positiveState, negativeTimeSpent, positiveTimeSpent]);
  

  useEffect(() => {
    const loadStartTimes = async () => {
      try {
        const savedStartTimes = await AsyncStorage.getItem("startTimes");
        if (savedStartTimes) {
          setStartTimes(JSON.parse(savedStartTimes));
        } else {
          // Initialize with default values if no data exists in AsyncStorage
          const defaultStartTimes = new Array(NEGATIVE_BEHAVIORS.length + POSITIVE_BEHAVIORS.length).fill(0);
          await AsyncStorage.setItem("startTimes", JSON.stringify(defaultStartTimes));
          setStartTimes(defaultStartTimes);
        }
      } catch (error) {
        console.error("Error loading startTimes from AsyncStorage:", error);
      }
    };
  
    loadStartTimes();
  }, []);

  
  useEffect(() => {
    const saveStartTimes = async () => {
      try {
        await AsyncStorage.setItem("startTimes", JSON.stringify(startTimes));
      } catch (error) {
        console.error("Error saving startTimes to AsyncStorage:", error);
      }
    };
  
    saveStartTimes();
  }, [startTimes]);

  
  useEffect(() => {
  
    const createAnimations = () => {
      const totalButtons = NEGATIVE_BEHAVIORS.length + POSITIVE_BEHAVIORS.length;
      const anims = Array.from({ length: totalButtons }, () => new Animated.Value(0));
      setAnimations(anims);

      anims.forEach((anim) => startFloatingAnimation(anim));
    };

    
    createAnimations();
  }, []);

  

  const scoreContext = useContext(ScoreContext);
  if (!scoreContext) {
    throw new Error("ScoreContext must be used within a ScoreProvider");
  }

  const { score, setScore } = scoreContext;

  const interpolateColor = (percentage, startColor, endColor) => {
    const startRGB = startColor.match(/\w\w/g).map((hex) => parseInt(hex, 16));
    const endRGB = endColor.match(/\w\w/g).map((hex) => parseInt(hex, 16));
  
    const interpolatedRGB = startRGB.map((start, i) => {
      const end = endRGB[i];
      return Math.round(start + (end - start) * percentage).toString(16).padStart(2, '0');
    });
  
    return `#${interpolatedRGB.join('')}`;
  };
  
  const getGradientColors = (percentage) => {
    const clampedPercentage = Math.min(100, Math.max(0, percentage));
    const ratio = clampedPercentage / 100;
  
    if (ratio <= 0.5) {
      // Interpolate from Red to Yellow (0% - 50%)
      const segmentRatio = ratio / 0.5;
      const startColor = '#E90E00'; // Red
      const endColor = '#FFFF00'; // Yellow
      const color = interpolateColor(segmentRatio, startColor, endColor);
      return ['#E90E00', color, '#FFFF00'];
    } else {
      // Interpolate from Yellow to Green (50% - 100%)
      const segmentRatio = (ratio - 0.5) / 0.5;
      const startColor = '#FFFF00'; // Yellow
      const endColor = '#00FF00'; // Green
      const color = interpolateColor(segmentRatio, startColor, endColor);
      return ['#FFFF00', color, '#00FF00'];
    }
  };

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

  const handleNegativePress = (index: number) => {
    setScore(score+4);

      Vibration.vibrate(500);
      const updatedNegativeTimeSpent = [...negativeTimeSpent];
      updatedNegativeTimeSpent[index] += 1;
      setNegativeTimeSpent(updatedNegativeTimeSpent);
      AsyncStorage.setItem("negativeTimeSpent", JSON.stringify(updatedNegativeTimeSpent));
  saveState();
  
  
  };
  

  const handlePositivePress = (index: number) => {
    
     setScore(score + 2);
      Vibration.vibrate(500);
     const updatedPositiveTimeSpent = [...positiveTimeSpent];
      updatedPositiveTimeSpent[index] += 1;
      setPositiveTimeSpent(updatedPositiveTimeSpent);
      AsyncStorage.setItem("positiveTimeSpent", JSON.stringify(updatedPositiveTimeSpent));
    
    saveState();
  
  };
  
  const allNegativeComplete = negativeState.every((state) => state);
  const allPositiveComplete = positiveState.every((state) => state);

  return (
    <LinearGradient colors={["#000000", "#111436","#24439E"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.columnContainer}>
          <Text style={styles.columnTitle}></Text>
          {NEGATIVE_BEHAVIORS.map((behavior, index) => (
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
              <LinearGradient colors={getGradientColors(negativeTimeSpent[index]%100)} style={styles.gradient}>
            
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.negativeButton,
                  ]}
                  onPress={() => handleNegativePress(index)}
                >
                  <Text style={styles.buttonText}>{behavior}</Text>
                  <Text style={styles.buttonTextt}>{ Math.round(negativeTimeSpent[index])}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          ))}
          {allNegativeComplete && <Text style={styles.rewardText}>UP</Text>}
        </View>

        <View style={styles.columnContainer}>
          <Text style={styles.columnTitle}></Text>
          {POSITIVE_BEHAVIORS.map((behavior, index) => (
            <Animated.View
              key={index + NEGATIVE_BEHAVIORS.length}
              style={{
                transform: [
                  {
                    translateY: animations[index + NEGATIVE_BEHAVIORS.length]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 10],
                    }) || 0,
                  },
                ],
              }}
            >
             <LinearGradient colors={getGradientColors(positiveTimeSpent[index]%100)} style={styles.gradient}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.positiveButton,
                  ]}
                  onPress={() => handlePositivePress(index)}
                >
                  <Text style={styles.buttonText}>{behavior}</Text>
                  <Text style={styles.buttonTextt}>{Math.round(positiveTimeSpent[index])}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          ))}
          {allPositiveComplete && <Text style={styles.rewardText}>UP</Text>}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flexDirection: "column", justifyContent: "space-around", paddingVertical: 20 },
  columnContainer: { flex: 1, alignItems: "center" },
  columnTitle: { fontSize: 20, fontWeight: "bold", color: "#FFD700"},
  button: {
    width: 300,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    elevation: 100,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  negativeButton: {  },
  negativeButtonActive: {backgroundColor: "#32CD32"  },
  positiveButton: {  },
  positiveButtonActive: { backgroundColor: "#32CD32" },
  buttonText: { fontSize: 14,
    fontFamily: "revert",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textTransform: "uppercase",
    textShadowColor: "rgba(233, 239, 48, 0.75)", // Glowing color (e.g., green)
    textShadowOffset: { width: 0, height: 0 }, // Offset of the shadow
    textShadowRadius: 6, },
    buttonTextt: { fontSize: 24,
      fontFamily: "revert",
      fontWeight: "bold",
      color: "white",
      textAlign: "center",
      textTransform: "uppercase",
      textShadowColor: "rgba(255, 234, 6, 0.75)", // Glowing color (e.g., green)
      textShadowOffset: { width: 0, height: 0 }, // Offset of the shadow
      textShadowRadius: 6, },
  rewardText: { fontSize: 18, fontWeight: "bold", color: "#FFD700", marginTop: 10 },
  gradient: {
    padding: 20,
    borderRadius: 40,
    shadowColor: "#9A9E24",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
    marginBottom:5,
  },
});

export default BehaviorTracker;
