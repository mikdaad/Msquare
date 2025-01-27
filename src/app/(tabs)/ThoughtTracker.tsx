import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  PanResponder,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // Brain icon
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const ThoughtTracker: React.FC = () => {
  const [currentThought, setCurrentThought] = useState<string>("Blank---");
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [newThought, setNewThought] = useState<string>("");
  const [pan] = useState(new Animated.ValueXY()); // For drag and drop
  const [draggedThought, setDraggedThought] = useState<string | null>(null);

  useEffect(() => {
    const loadThoughts = async () => {
      try {
        const savedThoughts = await AsyncStorage.getItem("thoughts");
        const savedCurrentThought = await AsyncStorage.getItem("currentThought");
        if (savedThoughts) setThoughts(JSON.parse(savedThoughts));
        if (savedCurrentThought) setCurrentThought(savedCurrentThought);
      } catch (error) {
        console.error("Error loading thoughts: ", error);
      }
    };
    loadThoughts();
  }, []);

  const saveThoughts = async (thoughtsToSave: string[], current?: string) => {
    try {
      await AsyncStorage.setItem("thoughts", JSON.stringify(thoughtsToSave));
      if (current !== undefined) {
        await AsyncStorage.setItem("currentThought", current);
      }
    } catch (error) {
      console.error("Error saving thoughts: ", error);
    }
  };

  const addThought = () => {
    if (newThought.trim() !== "") {
      const updatedThoughts = [...thoughts, newThought];
      setThoughts(updatedThoughts);
      saveThoughts(updatedThoughts);
      setNewThought("");
    }
  };

  const removeThought = (index: number) => {
    const updatedThoughts = thoughts.filter((_, i) => i !== index);
    setThoughts(updatedThoughts);
    saveThoughts(updatedThoughts);
  };

  const replaceThought = () => {
    if (draggedThought) {
      setCurrentThought(draggedThought);
      const updatedThoughts = thoughts.filter((thought) => thought !== draggedThought);
      setThoughts(updatedThoughts);
      saveThoughts(updatedThoughts, draggedThought);
      setDraggedThought(null); // Reset dragged thought
    }
  };

  // Drag functionality
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !!draggedThought, // Allow dragging only when a thought is selected
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value,
      });
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, gestureState) => {
      // Check if dropped in the brain area
      if (
        gestureState.moveY > height * 0.3 &&
        gestureState.moveY < height * 0.5 &&
        gestureState.moveX > width * 0.25 &&
        gestureState.moveX < width * 0.75
      ) {
        replaceThought();
      }
      pan.flattenOffset();
    },
  });

  const eliminate = () => {
    setCurrentThought("");  }

  return (
    <LinearGradient colors={["#1E1E2F", "#3A3A5C", "#6A6AD6"]} style={styles.container}>
      <Text style={styles.header}  onPress={eliminate}>{currentThought}</Text>

      {/* Current Thought */}
      <View style={styles.brainContainer}>
      <Ionicons name="aperture-outline" size={80} color="#FFD700" />
        
      </View>

      {/* Thought Box */}
      <View style={styles.thoughtBox}>
        <Text style={styles.thoughtBoxHeader}>*</Text>
        <FlatList
          data={thoughts}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => setDraggedThought(item)}
              style={[
                styles.thoughtItem,
                draggedThought === item && styles.selectedThought,
              ]}
            >
              <Text style={styles.thoughtText}>{item}</Text>
              <TouchableOpacity onPress={() => removeThought(index)}>
                <Ionicons name="trash" size={24} color="#FF6347" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Dragged Thought */}
      {draggedThought && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[pan.getLayout(), styles.draggedThoughtContainer]}
        >
          <Text style={styles.draggedThought}>{draggedThought}</Text>
        </Animated.View>
      )}

      {/* Add Thought */}
      <View style={styles.addThoughtContainer}>
        <TextInput
          style={styles.input}
          placeholder="+..."
          placeholderTextColor="#888"
          value={newThought}
          onChangeText={setNewThought}
        />
        <TouchableOpacity onPress={addThought} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:20,
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: "aqua",
  textDecorationColor:"white",
  },
  brainContainer: {
    alignItems: "center",
    marginVertical: 0,
    
  },
  currentThought: {
    fontSize: 18,
    color: "#FFF",
    marginTop: 10,
    textAlign: "center",
  },
  thoughtBox: {
    flex: 1,
    backgroundColor: "#2A2A45",
    borderRadius: 15,
    padding: 10,
    marginVertical: 20,
  },
  thoughtBoxHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10,
  },
  thoughtItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#444466",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  selectedThought: {
    backgroundColor: "#FFD700",
  },
  thoughtText: {
    color: "#FFF",
    fontSize: 16,
  },
  draggedThoughtContainer: {
    position: "absolute",
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  draggedThought: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  addThoughtContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    color: "#FFF",
    marginRight: 10,
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 10,
    marginBottom: 30,
  },
  addButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  
});

export default ThoughtTracker;
