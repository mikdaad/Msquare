import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';

// Define the type for items
interface Item {
  name: string;
  score: string;
  key: string;
}

const TabContent = ({
  title,
  storageKey,
  defaultItems,
}: {
  title: string;
  storageKey: string;
  defaultItems: Item[];
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<string>('');

  // Load saved data from AsyncStorage on app load
  useEffect(() => {
    const loadItems = async () => {
      const storedItems = await AsyncStorage.getItem(storageKey);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      } else {
        setItems(defaultItems);
      }
    };
    loadItems();
  }, [storageKey]);

  // Save items to AsyncStorage whenever they change
  const saveItemsToStorage = async (items: Item[]) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving items to storage:', error);
    }
  };

  useEffect(() => {
    saveItemsToStorage(items);
  }, [items]);

  // Update score
  const handleUpdateScore = (key: string) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.key === key
          ? { ...item, score: (parseInt(item.score || '0', 10) + 90).toString() }
          : item
      );
      return updatedItems;
    });
  };

 // Add a new item
const handleAddItem = () => {
  if (newItem.trim()) {
    const uniqueKey = `${Date.now()}-${Math.random()}`;
    const newEntry: Item = {
      name: newItem,
      score: '0', // Ensure score is initialized to 0
      key: uniqueKey, // Use unique key for the new item
    };
    setItems((prevItems) => [...prevItems, newEntry]);
    setNewItem('');
  }
};

// Delete an item
const handleDeleteItem = (key: string) => {
  setItems((prevItems) => prevItems.filter((item) => item.key !== key));
};


  // Handle drag-and-drop reordering
  const handleDragEnd = ({ data }: { data: Item[] }) => {
    setItems(data);
  };

  // Render a list item
  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        item.key === '1' && styles.topPriority, // Highlight top priority (if necessary)
        isActive && styles.activeItem, // Highlight during drag
      ]}
      onPress={() => handleUpdateScore(item.key)} // Use item.key to update score
      onLongPress={drag} // Trigger drag functionality
    >
      <View>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.scoreText}>hours: {item.score} </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteItem(item.key)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Draggable List */}
      <DraggableFlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.listContent}
      />
  
      {/* Add New Item Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={` populate ^ `}
          placeholderTextColor="#aaa"
          value={newItem}
          onChangeText={setNewItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}> + </Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
  
};

const FocusList = () => (
  <TabContent
    title="F List"
    storageKey="FocusList"
    defaultItems={[
    
    ]}
  />
);

const CreativeList = () => (
  <TabContent
    title="C List"
    storageKey="CreativeList"
    defaultItems={[
      
    ]}
  />
);

const Crillers = () => (
  <TabContent
    title="C List"
    storageKey="Crillers"
    defaultItems={[
      { name: 'Active Listening', score: '0', key: '1' },
      { name: 'Conflict Resolution', score: '0', key: '2' },
      { name: 'Non-Verbal Cues', score: '0', key: '3' },
    ]}
  />
);

const Crill = () => (
  <TabContent
    title="C List"
    storageKey="Crill"
    defaultItems={[
      { name: 'Active Listening', score: '0', key: '1' },
      { name: 'Conflict Resolution', score: '0', key: '2' },
      { name: 'Non-Verbal Cues', score: '0', key: '3' },
    ]}
  />
);
const rewards = () => (
  <TabContent
    title="Rewards List"
    storageKey="rewardlist"
    defaultItems={[
     
    ]}
  />
);



const App = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'Focus', title: 'Fcs' },
    { key: 'Creative', title: 'Crtve' },
    { key: 'Crillers', title: 'Criller' },
    { key: 'Crill', title: 'Crill' },
    { key: 'rewards', title: 'rwrds' },
  ]);

  const renderScene = SceneMap({
    Focus: FocusList,
    Creative: CreativeList,
    Crillers: Crillers,
    Crill: Crill,
    rewards: rewards,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      tabBarPosition='top'
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: '#FFD700' }}
          style={{ backgroundColor: '#010101' }}
          labelStyle={{ color: '#EDFFF1', fontSize: 16 }}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 40, // Add padding to avoid overlapping with the input container
  },
  inputContainer: {
    position: 'absolute', // Keep it fixed at the bottom
    bottom: 4,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#010101',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginBottom: 40,
    fontSize: 16,
    color: '#EDFFF1',
    backgroundColor: '#1E1E1E',
  },
  addButton: {
    backgroundColor: '#FFD700',
    marginBottom: 40,
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#010101',
    fontSize: 16,
  },
  itemContainer: {
    padding: 15,
    marginVertical: 2,
    backgroundColor: '#222',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#4f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EDFFF1',
  },
  scoreText: {
    fontSize: 14,
    color: '#EDFFF1',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  
});

export default App;
