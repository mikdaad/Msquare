import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ScoreContext } from "../(auth)/scorecontext";

const RelaxingTechniquesComponent = ({ defaultLocations, storageKey }) => {
  const [data, setData] = useState(defaultLocations);

  const scoreContext = useContext(ScoreContext);
    
    if (!scoreContext) {
      throw new Error('ScoreContext must be used within a ScoreProvider');
    }

    const { score, setScore } = scoreContext;


  // Load data from AsyncStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(storageKey);
        if (storedData) {
          setData(JSON.parse(storedData));
        } else {
          await AsyncStorage.setItem(storageKey, JSON.stringify(defaultLocations));
        }
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      }
    };
    loadData();
  }, [storageKey, defaultLocations]);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(data));
      } catch (error) {
        console.error("Error saving data to AsyncStorage:", error);
      }
    };
    saveData();
  }, [data, storageKey]);

  const handlePress = (locationIndex, techniqueIndex) => {
    const newData = [...data];
    const technique = newData[locationIndex].techniques[techniqueIndex];

    if (technique.count < 7) {
      technique.count += 1;
      setData(newData);
      setScore(score + 1);
    } else {
      console.log("Maximum score for this item reached.");
    }
  };

  

  return (
    <ScrollView style={styles.container}>
      {data.map((location, locIndex) => (
        <View key={locIndex} style={styles.location}>
          {location.techniques.map((technique, techIndex) => (
            <View key={technique.id} style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => handlePress(locIndex, techIndex)}
              >
                <Text style={styles.buttonText}>{`${technique.name} (${technique.count})`}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const MatrixTab = () => {
  const defaultLocations = [
    {
      location: "Explode",
      techniques: [
        
        { id: "999", name: "grit evoke forward continuous const Acts  - from deep passive.", count: 0 },
        { id: "99", name: "Grind Shorts", count: 0 },
        { id: "1", name: "GRIP x JAWLINE", count: 0 },
        { id: "2", name: "BAND EXERCISES", count: 0 },
        { id: "3", name: "whole vibre (10)", count: 0 },
        { id: "4", name: "Bioenergetics - ha hi hu PRA continuous action", count: 0 },
        { id: "5", name: "CONTINUOUS pelvic inst (10)", count: 0 },
        { id: "47", name: "*continuous onpoint elongba only , without stimul.", count: 0 },
        
      ],
    },
    {
      location: "OFF",
      techniques: [
        { id: "6", name: "WIMHOFF", count: 0 },
        { id: "7", name: "mosq major refresher - sbv in mosq", count: 0 },
        { id: "8", name: "obe timedsqueeze", count: 0 },
        { id: "9", name: "sbv med (the shutdown body pose) (10)", count: 0 },
        { id: "10", name: "leg consciousness wholeba walk (15)", count: 0 },
        { id: "11", name: "SHORT MED", count: 0 },
        { id: "12", name: "BG - TONES", count: 0 },
      ],
    },
    {
      location: "Fire",
      techniques: [
        { id: "109", name: "Grind Shorts", count: 0 },
        { id: "49", name: "Transferance", count: 0 },
        { id: "13", name: "High kick continuous long, Kick punches - 10 mins", count: 0 },
        { id: "14", name: "wholeba establish (high vibre) - 10 mins", count: 0 },
        { id: "15", name: "ha hi hu PRA continuous action", count: 0 },
       
      ],
    },
    {
      location: "Catch",
      techniques: [
        { id: "16", name: "BRAIN APPLE", count: 0 },
        { id: "17", name: "REALIZE UPTO BREATH - survival (5), SPIRIT KICK (5) --> SWIPES", count: 0 },
        { id: "18", name: "KUNDALINI / kegels (15)", count: 0 },
        { id: "19", name: "THE short GRINDS (10)", count: 0 },
      ],
    },
  ];

  return <RelaxingTechniquesComponent defaultLocations={defaultLocations} storageKey="matrixCount" />;
};

const OutTab = () => {
  const defaultLocations = [
    {
      location: "Explode",
      techniques: [
        { id: "999", name: "grit evoke forward continuous const Acts  - from deep passive.", count: 0 },
        { id: "99", name: "Grind Shorts", count: 0 },
        { id: "1", name: "RUN (10)", count: 0 },
        { id: "2", name: "BAND EXERCISES (10)", count: 0 },
        { id: "3", name: "leg consciousness wholeba walk (15)", count: 0 },
        { id: "4", name: "CONTINUOUS pelvic constrict (10)", count: 0 },
        { id: "40", name: "song chnnel to the liberation process(20)", count: 0 },
        { id: "47", name: "*continuous onpoint elongba only , without stimul.", count: 0 },
      ],
    },
     
    {
      location: "OFF",
      techniques: [
        { id: "5", name: "WIMHOFF(10)", count: 0 },
        { id: "6", name: "NSDR (10)", count: 0 },
        { id: "7", name: "SHORT MED", count: 0 },
        { id: "8", name: "sbv med (the shutdown pose ) (10)", count: 0 },
        { id: "9", name: "mosq - sbv.", count: 0 },
        { id: "10", name: "obe timedsqueeze (10) -  BG", count: 0 },
      ],
    },
    {
      location: "Fire",
      techniques: [
        { id: "109", name: "Grind Shorts", count: 0 },
        { id: "49", name: "Transferance", count: 0 },
        { id: "11", name: "High kick continous long , Kick punches -10 mins", count: 0 },
        { id: "12", name: "wholeba establish (high vibre) - 10 mins.", count: 0 },
        { id: "13", name: "Bioenergetics - ha hi hu PRA continous action.", count: 0 },
        
      ],
    },
    {
      location: "Catch",
      techniques: [
        { id: "14", name: "BRAIN APPLE.", count: 0 },
        { id: "15", name: "REALIZE UPTO BREATH - survival.(5), SPIRIT KICK.(5)--> SWIPES.", count: 0 },
        { id: "16", name: "Bioenergetics - ha hi hu PRA continous action.", count: 0 },
        { id: "17", name: "KUNDALINI / kegels (15).", count: 0 },
        { id: "18", name: "THE short GRINDS.(10)", count: 0 },
        
      ],
    },
  ];
  return <RelaxingTechniquesComponent defaultLocations={defaultLocations} storageKey="outCount" />;
};

const HomeTab = () => {
  const defaultLocations = [
    {
      location: "Explode",
      techniques: [
        { id: "999", name: "grit evoke forward continuous const Acts  - from deep passive.", count: 0 },
        { id: "1", name: "ICE FACE, EYE", count: 0 },
        { id: "2", name: "stone roller x aloe vera - 15 mins", count: 0 },
        { id: "3", name: "moisturizer x guasha - 10 mins", count: 0 },
        { id: "4", name: "derma roller (if optimized)", count: 0 },
        { id: "43", name: "lumosity(10)", count: 0 },
        { id: "45", name: "chess - 1", count: 0 },
        { id: "47", name: "*continuous onpoint elongba only , without stimul.", count: 0 },

        
      ],
    },
    

    {
      location: "OFF",
      techniques: [
        { id: "9", name: "WIMHOFF", count: 0 },
        { id: "10", name: "mosq major refresher. - sbv in mosq.", count: 0 },
        { id: "11", name: "whole vibre (5)", count: 0 },
        { id: "12", name: "SHORT MEDS FREQ", count: 0 },
        { id: "13", name: "NSDR (10)", count: 0 },
        { id: "14", name: "sbv med (the shutdown body pose ) (10)", count: 0 },
        { id: "15", name: "leg consciousness wholeba walk (10).", count: 0 },
        { id: "16", name: "obe timedsqueeze.", count: 0 },
        { id: "17", name: "BG - TONES.", count: 0 },
      ],
    },
    {
      location: "Fire",
      techniques: [
        { id: "99", name: "Grind Shorts", count: 0 },
        { id: "51", name: "60 FLOW.", count: 0 },
        { id: "49", name: "Transferance", count: 0 },
        { id: "18", name: "SKIPPING (10)", count: 0 },
        { id: "19", name: "MOUTHNECKXP.(15)", count: 0 },
        { id: "20", name: "GRIP x JAWLINE.", count: 0 },
        { id: "21", name: "BAND EXERCISES.", count: 0 },
       
      ],
    },
    {
      location: "Catch",
      techniques: [
        { id: "22", name: "BRAIN APPLE.", count: 0 },
        { id: "23", name: "REALIZE UPTO BREATH - survival.(5), SPIRIT KICK.(5)--> SWIPES.", count: 0 },
        { id: "24", name: "KUNDALINI / kegels (15).", count: 0 },
        { id: "25", name: "THE short GRINDS.(10).", count: 0 },
      ],
    },
  ];

  return <RelaxingTechniquesComponent defaultLocations={defaultLocations} storageKey="homeCount" />;
};

const RelaxingTechniquesApp = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "black" },
        tabBarIndicatorStyle: { backgroundColor: "#FFEA00" },
        tabBarLabelStyle: { color: "#fff", fontWeight: "bold" },
      }}
    >
      <Tab.Screen name="Zones" component={MatrixTab} />
      <Tab.Screen name="Out" component={OutTab} />
      <Tab.Screen name="Home" component={HomeTab} />
    </Tab.Navigator>
  );
};






const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "darkblue",
    marginBottom:40,
  },
  location: {
    marginBottom: 20,
    backgroundColor: "#081FA4",
    alignItems: "center",
    borderRadius: 50,
    padding: 20,
    
  },
  header: {
    color: "#11FE12",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform:"uppercase",
    width:200,
    marginLeft:70,
    
  },
  buttonContainer: {
    backgroundColor: "#081FA4",
    fontWeight: "bold",
    borderRadius: 30,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "sans-serif-light",
    fontSize: 16,
    color: "white",
    textTransform: "uppercase",
    textShadowColor: "rgba(234, 255, 2, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
});

export default RelaxingTechniquesApp;

