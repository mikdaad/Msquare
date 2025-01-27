import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScoreContext } from "../(auth)/scorecontext";

const NUTRITIONS: Record<string, string[]> = {
  category1: ["Chia Seeds", "Salt Water", "Short Caffeine", "Turmeric"],
  category2: ["Egg 4", "green beans + peas", "Soyachunks"],
  category3: ["Cucumber", "Carrot", "Ginger", "Garlic"],
  category4: [
    "Dates",
    "Bananas",
    "Sweet Potato",
    "Horlicks",
    "water1",
    "water2",
    "water3",
    "water4",
    "water5",
    "water6",
    "water7",
    "water8",
    "water9",
    "water10",
    "water11",
  ],
};

type SelectedItems = {
  category1: string | null;
  category2: string | null;
  category3: string[];
  category4: string[];
};

const NutritionTracker: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    category1: null,
    category2: null,
    category3: [],
    category4: [],
  });

  const scoreContext = useContext(ScoreContext);
  if (!scoreContext) {
    throw new Error("ScoreContext must be used within a ScoreProvider");
  }

  const { score, setScore } = scoreContext;

  // Function to retrieve and set state from AsyncStorage
  const loadAndSetState = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]; // Get current date
      const storedState = await AsyncStorage.getItem("nutritionState");
      const lastResetDate = await AsyncStorage.getItem("lstResetDate");

      if (!lastResetDate || lastResetDate !== today) {
        // Reset state for a new day
        await AsyncStorage.setItem("lstResetDate", today);
        await AsyncStorage.removeItem("nutritionState");
        setSelectedItems({
          category1: null,
          category2: null,
          category3: [],
          category4: [],
        });
      } else if (storedState) {
        setSelectedItems(JSON.parse(storedState));
      }
    } catch (error) {
      console.error("Error loading and setting state:", error);
    }
  };

  useEffect(() => {
    loadAndSetState();
  }, []);

  useEffect(() => {
    saveState();
  }, [selectedItems]);

  // Function to save the state to AsyncStorage
  const saveState = async () => {
    try {
      await AsyncStorage.setItem("nutritionState", JSON.stringify(selectedItems));
    } catch (error) {
      console.error("Error saving state:", error);
    }
  };

  // Function to check completion and increment score if all categories are filled
  const checkCompletionAndIncrementScore = async () => {
    const isCompleted =
      selectedItems.category1 !== null &&
      selectedItems.category2 !== null &&
      selectedItems.category3.length === 2 &&
      selectedItems.category4.length === 20;

    if (isCompleted) {
      try {
        const today = new Date().toISOString().split("T")[0];
        const lastScoreDate = await AsyncStorage.getItem("lastScoreDate");

        if (lastScoreDate !== today) {
          // Increment score only once per day
          setScore(score + 5);
          await AsyncStorage.setItem("lastScoreDate", today); // Set the date when the score was updated
        } else {
          console.log("Score has already been updated today.");
        }
      } catch (error) {
        console.error("Error updating score:", error);
      }
    }
  };

  // Handle item selection for categories
  const handleSelect = (category: string, item: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: prev[category]?.includes(item)
        ? prev[category].filter((i) => i !== item)
        : [...(prev[category] || []), item],
    }));
  };

  // Render buttons for each category
  const renderButtons = (category: string, items: string[]) => {
    return items.map((item) => (
      <TouchableOpacity
        key={item}
        style={[
          styles.button,
          styles[category],
          selectedItems[category]?.includes(item) || selectedItems[category] === item
            ? styles.selectedButton
            : {},
        ]}
        onPress={() => handleSelect(category, item)}
      >
        <Text style={styles.buttonText}>{item}</Text>
      </TouchableOpacity>
    ));
  };

  useEffect(() => {
    saveState();
    checkCompletionAndIncrementScore();
  }, [selectedItems]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(NUTRITIONS).map((category) => (
        <View key={category} style={styles.categoryContainer}>
          {/* <Text style={styles.categoryTitle}>{category}</Text> */} 
          <View style={styles.buttonContainer}>
            {renderButtons(category, NUTRITIONS[category])}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#000000",
  },
  categoryContainer: {
    marginTop: 20,
  },
  categoryTitle: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  button: {
    padding: 11,
    borderRadius: 8,
    margin: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedButton: {
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  category1: {
    backgroundColor: "#FF8C00",
  },
  category2: {
    backgroundColor: "#1E90FF",
  },
  category3: {
    backgroundColor: "#32CD32",
  },
  category4: {
    backgroundColor: "#8A2BE2",
  },
});

export default NutritionTracker;