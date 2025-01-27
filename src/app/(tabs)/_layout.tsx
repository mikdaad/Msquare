import React from "react";
import { View, Text, StyleSheet,StatusBar } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HabitProgressTracker from "./compound"; 
import HabitProgressTracker2 from "./compound2"; 
import App from "./dcprop"; 
import GoalTracker from "./goals"; 
import HabitTracker from "./index"; 
import AnatomyIcon from "./liberation"; 
import MoriningApp from "./morning"; 
import NutritionTracker from "./nutrition"; 
import BehaviorTracker from "./plast"; 
import StatisticsScreen from "./stats";
import ThoughtTracker from "./ThoughtTracker";
import RelaxingTechniquesApp from "./unexisters";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { ScoreProvider } from '../(auth)/scorecontext';

const Drawer = createDrawerNavigator();

const GoalScreen = () => <GoalTracker />;
const HabitScreen = () => <HabitTracker />;
const CompoundScreen = () => <HabitProgressTracker />;
const CompoundScreen2 = () => <HabitProgressTracker2 />;
const DcPropScreen = () => <App />;
const LiberationScreen = () => <AnatomyIcon />;
const MorningScreen = () => <MoriningApp />;
const NutritionScreen = () => <NutritionTracker />;
const PlastScreen = () => <BehaviorTracker />;
const StatsScreen = () => <StatisticsScreen />;
const ThoughtsScreen = () => <ThoughtTracker />;
const UnexistersScreen = () => <RelaxingTechniquesApp />;

const SettingsScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Settings Screen</Text>
  </View>
);

const AppDrawer = () => {
  return (
    <ScoreProvider>
      <StatusBar hidden={true} />
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#000" },
          drawerPosition: "right",
          overlayColor: "transparent",
          headerTintColor: "#fff",
          drawerStyle: { backgroundColor: "#111",width: 100, marginTop: 120,},
          drawerActiveTintColor: "#FFD700",
          drawerInactiveTintColor: "#fff",
          headerShown:false,
          drawerLabel: () => null,
        }}
      >
        <Drawer.Screen
          name="^"
          component={GoalScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <FontAwesome5 name="crown" size={28} color="gold" />
            ),
          }}
        />
        <Drawer.Screen
          name="Seeding"
          component={MorningScreen}
          options={{
            drawerIcon: ({ color, size }) => (
             <Feather name="sun" size={28}  color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Now"
          component={HabitScreen}
          options={{
            drawerIcon: ({ color, size }) => (

           
              <MaterialIcons name="center-focus-strong" size={28} color={color} />

            ),
          }}
        />
        <Drawer.Screen
          name="Weapons"
          component={DcPropScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <AntDesign name="dashboard" size={28}  color={color}  />
            ),
          }}
        />
        <Drawer.Screen
          name="*"
          component={CompoundScreen}
          options={{
            drawerIcon: ({ color, size }) => (
       
          <Entypo name="arrow-with-circle-up" size={35} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="**"
          component={CompoundScreen2}
          options={{
            drawerIcon: ({ color, size }) => (
          
          <Entypo name="arrow-up" size={35} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="EXP"
          component={UnexistersScreen}
          options={{
            drawerIcon: ({ color, size }) => (
          <FontAwesome name="magic" size={28} color={color}  />
            ),
          }}
        />
          <Drawer.Screen
          name="----->"
          component={PlastScreen}
          options={{
            drawerIcon: ({ color, size }) => (
          <AntDesign name="arrowdown" size={35} color={color} />
   
            ),
          }}
        />
        <Drawer.Screen
          name="Lib"
          component={LiberationScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Entypo name="500px" size={35} color={color} />

            ),
          }}
        />
        <Drawer.Screen
          name="T.pra"
          component={ThoughtsScreen}
          options={{
            drawerIcon: ({ color, size }) => (
       
          <MaterialCommunityIcons name="thought-bubble" size={28} color={color} />
            ),
          }}
        />
       
         <Drawer.Screen
          name="Nuts"
          component={NutritionScreen}
          options={{
            drawerIcon: ({ color, size }) => (
       

              <FontAwesome name="pagelines" size={28} color={color} />
            ),
          }}
        />
          <Drawer.Screen
          name="Stat"
          component={StatsScreen}
          options={{
            drawerIcon: ({ color, size }) => (
       

          <AntDesign name="linechart" size={28} color={color} />
            ),
          }}
        />
        
        

      </Drawer.Navigator>
    
    </ScoreProvider>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  screenText: {
    color: "#fff",
    fontSize: 20,
  },
});

export default AppDrawer;
