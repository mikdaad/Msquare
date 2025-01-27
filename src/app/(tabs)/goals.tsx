import React, { useState, useEffect ,useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import DraggableFlatList from "react-native-draggable-flatlist";
import { ScoreContext } from '../(auth)/scorecontext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get("window");

interface Goal {
  text: string;
  deadline: string;
}

const GoalTracker: React.FC = () => {
  const [IntentNowGoals, setIntentNowGoals] = useState<Goal[]>([]);
  const [shortTermGoals, setShortTermGoals] = useState<Goal[]>([]);
  const [longTermGoals, setLongTermGoals] = useState<Goal[]>([]);
  const [coreGoals, setCoreGoals] = useState<Goal[]>([]);

  const [newGoals, setNewGoals] = useState({
    IntentNow: { text: "", deadline: "" },
    short: { text: "", deadline: "" },
    long: { text: "", deadline: "" },
    core: { text: "", deadline: "" },
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "IntentNow", title: "I*" },
    { key: "long", title: "^" },
    { key: "core", title: "In" },
  ]);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const savedIntentNowGoals = await AsyncStorage.getItem("IntentNowGoals");
        const savedShortTermGoals = await AsyncStorage.getItem("shortTermGoals");
        const savedLongTermGoals = await AsyncStorage.getItem("longTermGoals");
        const savedCoreGoals = await AsyncStorage.getItem("coreGoals");

        if (savedIntentNowGoals) setIntentNowGoals(JSON.parse(savedIntentNowGoals));
        if (savedShortTermGoals) setShortTermGoals(JSON.parse(savedShortTermGoals));
        if (savedLongTermGoals) setLongTermGoals(JSON.parse(savedLongTermGoals));
        if (savedCoreGoals) setCoreGoals(JSON.parse(savedCoreGoals));
      } catch (error) {
        console.error("Error loading goals: ", error);
      }
    };

    loadGoals();
  }, []);

  const saveGoals = async (key: string, goals: Goal[]) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(goals));
    } catch (error) {
      console.error("Error saving goals: ", error);
    }
  };

  const addGoal = (goal: Goal, type: "IntentNow" | "short" | "long" | "core") => {
    if (goal.text.trim() === "" || goal.deadline.trim() === "") return;

    let updatedGoals = [];
    if (type === "IntentNow") {
      updatedGoals = [...IntentNowGoals, goal];
      setIntentNowGoals(updatedGoals);
      saveGoals("IntentNowGoals", updatedGoals);
    } else if (type === "short") {
      updatedGoals = [...shortTermGoals, goal];
      setShortTermGoals(updatedGoals);
      saveGoals("shortTermGoals", updatedGoals);
    } else if (type === "long") {
      updatedGoals = [...longTermGoals, goal];
      setLongTermGoals(updatedGoals);
      saveGoals("longTermGoals", updatedGoals);
    } else {
      updatedGoals = [...coreGoals, goal];
      setCoreGoals(updatedGoals);
      saveGoals("coreGoals", updatedGoals);
    }

    setNewGoals((prev) => ({ ...prev, [type]: { text: "", deadline: "" } }));
  };

    const scoreContext = useContext(ScoreContext);
    if (!scoreContext) {
      throw new Error("ScoreContext must be used within a ScoreProvider");
    }
    const { score, setScore } = scoreContext;

  const removeGoal = (index: number, type: "IntentNow" | "short" | "long" | "core") => {
    let updatedGoals = [];
    if (type === "IntentNow") {
      updatedGoals = IntentNowGoals.filter((_, i) => i !== index);
      setIntentNowGoals(updatedGoals);
      saveGoals("IntentNowGoals", updatedGoals);
    } else if (type === "short") {
      updatedGoals = shortTermGoals.filter((_, i) => i !== index);
      setShortTermGoals(updatedGoals);
      saveGoals("shortTermGoals", updatedGoals);
    } else if (type === "long") {
      updatedGoals = longTermGoals.filter((_, i) => i !== index);
      setLongTermGoals(updatedGoals);
      saveGoals("longTermGoals", updatedGoals);
    } else {
      updatedGoals = coreGoals.filter((_, i) => i !== index);
      setCoreGoals(updatedGoals);
      saveGoals("coreGoals", updatedGoals);
    }
    setScore(score+20);
  };

  const calculateRemainingDays = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };



  const renderGoalList = (
    goals: Goal[],
    type: "IntentNow" | "short" | "long" | "core"
  ) => (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.goalSection}>
        <DraggableFlatList
          data={goals}
          keyExtractor={(item, index) => `${type}-${index}`}
          onDragEnd={({ data }) => {
            if (type === "IntentNow") {
              setIntentNowGoals(data);
              saveGoals("IntentNowGoals", data);
            } else if (type === "short") {
              setShortTermGoals(data);
              saveGoals("shortTermGoals", data);
            } else if (type === "long") {
              setLongTermGoals(data);
              saveGoals("longTermGoals", data);
            } else {
              setCoreGoals(data);
              saveGoals("coreGoals", data);
            }
          }}
          renderItem={({ item, drag }) => (
            <TouchableOpacity
              style={styles.goalItem}
              onLongPress={drag}
            >
              <View style={styles.goalItemContent}>
                <Text style={styles.goalText} numberOfLines={1} ellipsizeMode="tail">
                  {item.text}
                </Text>
                <Text style={styles.goalDeadline}>
                  {calculateRemainingDays(item.deadline)} days
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeGoal(goals.indexOf(item), type)}>
              <MaterialIcons name="done-outline" size={38} color="yellow" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            placeholder="^"
            placeholderTextColor="#888"
            value={newGoals[type].text}
            onChangeText={(text) =>
              setNewGoals((prev) => ({ ...prev, [type]: { ...prev[type], text } }))
            }
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="y-m-d"
            placeholderTextColor="#888"
            value={newGoals[type].deadline}
            onChangeText={(text) =>
              setNewGoals((prev) => ({ ...prev, [type]: { ...prev[type], deadline: text } }))
            }
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addGoal(newGoals[type], type)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  const renderScene = SceneMap({
    IntentNow: () => renderGoalList(IntentNowGoals, "IntentNow"),
    long: () => renderGoalList(longTermGoals, "long"),
    core: () => renderGoalList(coreGoals, "core"),
  });

  return (
    <LinearGradient colors={["#3C20FB", "#0DE3F6", "#2A0E04"]} style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#FFD700" }}
            style={{ backgroundColor: "#000000", borderRadius: 40, height: 60 }}
            labelStyle={{ color: "#FFF" }}
          />
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  goalSection: {
    flex: 1,
    marginBottom: 10,
  },
  goalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0065FF",
    padding: 15,
    borderRadius: 15,
    marginVertical: 5,
  },
  goalItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  goalText: {
    flex: 1,
    fontSize: 19,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    textShadowColor: "rgba(229, 228, 243, 0.75)", // Glowing color (e.g., green)
    textShadowOffset: { width: 0, height: 0 }, // Offset of the shadow
    textShadowRadius: 6
  },
  goalDeadline: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
    marginRight:6,
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Glowing color (e.g., green)
    textShadowOffset: { width: 0, height: 0 }, // Offset of the shadow
    textShadowRadius: 6
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    color: "#FFF",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default GoalTracker;
