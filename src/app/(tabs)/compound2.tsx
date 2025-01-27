import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons"; // Import icon library
import DraggableFlatList from "react-native-draggable-flatlist";

const { width } = Dimensions.get("window");

interface Habit {
  id: string;
  name: string;
  progress: number;
}

const HabitProgressTracker2: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<string>("");

  useEffect(() => {
    const loadHabits = async () => {
      try {
        const storedHabits = await AsyncStorage.getItem("habits2");
        if (storedHabits) {
          setHabits(JSON.parse(storedHabits));
        }
      } catch (error) {
        console.error("Failed to load habits:", error);
      }
    };

    loadHabits();
  }, []);

  const saveHabits = async (updatedHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem("habits2", JSON.stringify(updatedHabits));
    } catch (error) {
      console.error("Failed to save habits:", error);
    }
  };

  const addHabit = () => {
    if (newHabit.trim() === "") return;
    const newHabitEntry: Habit = {
      id: `${Date.now()}`,
      name: newHabit,
      progress: 0,
    };
    const updatedHabits = [...habits, newHabitEntry];
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    setNewHabit("");
  };

  const updateProgress = async (id: string, progress: number) => {
    try {
      const updatedHabits = habits.map((habit) =>
        habit.id === id ? { ...habit, progress } : habit
      );
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
    } catch (error) {
      console.error("Failed to update habit progress:", error);
    }
  };

  const deleteHabit = async (id: string) => {
    Alert.alert(
      "Delete ",
      "Are you sure you want to delete this compounder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedHabits = habits.filter((habit) => habit.id !== id);
            setHabits(updatedHabits);
            await saveHabits(updatedHabits);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderHabit = ({ item }: { item: Habit }) => (
    <LinearGradient
      colors={["#031335", "#072152"]}
      style={styles.habitContainer}
    >
      {/* Habit Details */}
      <View style={styles.habitHeader}>
        <Text style={styles.habitName}>{item.name}</Text>
        <TouchableOpacity onPress={() => deleteHabit(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#FF4E4E" />
        </TouchableOpacity>
      </View>
      <Text style={styles.habitProgress}>Progress: {item.progress}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Update progress"
        placeholderTextColor="#888"
        onChange={(e) =>
          updateProgress(item.id, parseInt(e.nativeEvent.text) || 0)
        }
      />
    </LinearGradient>
  );

  return (
    <LinearGradient colors={["#031335", "#072152"]} style={styles.container}>
      {/* Habit List */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={renderHabit}
        contentContainerStyle={styles.listContainer}
      />

      {/* Add Habit */}
      <View style={styles.addHabitContainer}>
        <TextInput
          style={styles.addHabitInput}
          placeholder="+"
          placeholderTextColor="#888"
          value={newHabit}
          onChangeText={setNewHabit}
        />
        <TouchableOpacity onPress={addHabit} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.95,
    padding: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  habitContainer: {
    marginVertical: 10,
    borderRadius: 15,
    padding: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  habitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  habitName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  habitProgress: {
    fontSize: 16,
    color: "#FFF",
    marginVertical: 5,
  },
  input: {
    marginTop: 10,
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    color: "#FFF",
  },
  addHabitContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  addHabitInput: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    color: "#FFF",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#6A6AD6",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default HabitProgressTracker2;
