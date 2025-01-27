import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';
import { ScoreContext } from '../(auth)/scorecontext';
import LottieView from 'lottie-react-native'; // Import Lottie
import AsyncStorage from "@react-native-async-storage/async-storage";

const AnimatedRect = Animated.createAnimatedComponent(Rect);



const AnatomyIcon = () => {
  const liquidHeight = useSharedValue(0); // We will animate this value
  const [showCelebration, setShowCelebration] = useState(false);
  const [showlib, setshowlib] = useState(false); // state to trigger the celebration
  const [libscore, setlibscore] = useState(0);

  const scoreContext = useContext(ScoreContext);
  
  if (!scoreContext) {
    throw new Error('ScoreContext must be used within a ScoreProvider');
  }

  
  useEffect(() => {
    const loadThoughts = async () => {
      try {
        const savedlibscore = await AsyncStorage.getItem("libscore");
        if (savedlibscore) setlibscore(parseInt(savedlibscore)); // Load the saved score
      } catch (error) {
        console.error("Error loading thoughts: ", error);
      }
    };
    loadThoughts(); // Load the score when the component mounts
  }, []);
  
  useEffect(() => {
    const saveThoughts = async () => {
      try {
        await AsyncStorage.setItem("libscore", libscore.toString()); // Save the score whenever it changes
      } catch (error) {
        console.error("Error saving thoughts: ", error);
      }
    };
    saveThoughts(); // Trigger save when libscore updates
  }, [libscore]); // Dependency array to watch libscore
  


  const { score, setScore } = scoreContext;
  useEffect(() => {
    // Update the liquidHeight based on the score, animate it smoothly
    liquidHeight.value = withTiming((score / 100) * 300, { duration: 1000 });
    if(score>=99){
      setshowlib(true);
    }
    else{
      setshowlib(false);

    }
  }, [score]);

  const getLiquidColor = () => {
    const interpolateColor = (percentage) => {
      const startColor = [255, 0, 0]; // Red
      const endColor = [0, 255, 0]; // Green

      const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * percentage);
      const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * percentage);
      const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * percentage);

      return `rgb(${r}, ${g}, ${b})`;
    };

    const percentage = Math.min(Math.max(score / 100, 0), 1); // Clamp score between 0 and 100 and convert to percentage
    return interpolateColor(percentage);
  };

  const handleRewardPress = () => {
    setScore(0);
    setShowCelebration(true);
    setlibscore(libscore+1) // Trigger celebration
    setTimeout(() => setShowCelebration(false), 7000); // Hide after 4 seconds
  };

  // Define the animated props for the Rect (Liquid fill)
  const animatedProps = useAnimatedProps(() => {
    return {
      height: liquidHeight.value, // Animate the height based on liquidHeight
      y: 300 - liquidHeight.value, // Adjust the Y position so the liquid rises from the bottom
    };
  });

  return (
    <View style={styles.container}>
         <Text style={styles.liberationscore}> Liberations: {libscore}</Text>
      <Svg height="500" width="500" viewBox="0 -20 200 250" style={styles.svg}>
        {/* Human Body Outline */}
        <Path
          d="M104.265,117.959c-0.304,3.58,2.126,22.529,3.38,29.959c0.597,3.52,2.234,9.255,1.645,12.3 c-0.841,4.244-1.084,9.736-0.621,12.934c0.292,1.942,1.211,10.899-0.104,14.175c-0.688,1.718-1.949,10.522-1.949,10.522 c-3.285,8.294-1.431,7.886-1.431,7.886c1.017,1.248,2.759,0.098,2.759,0.098c1.327,0.846,2.246-0.201,2.246-0.201 c1.139,0.943,2.467-0.116,2.467-0.116c1.431,0.743,2.758-0.627,2.758-0.627c0.822,0.414,1.023-0.109,1.023-0.109 c2.466-0.158-1.376-8.05-1.376-8.05c-0.92-7.088,0.913-11.033,0.913-11.033c6.004-17.805,6.309-22.53,3.909-29.24 c-0.676-1.937-0.847-2.704-0.536-3.545c0.719-1.941,0.195-9.748,1.072-12.848c1.692-5.979,3.361-21.142,4.231-28.217 c1.169-9.53-4.141-22.308-4.141-22.308c-1.163-5.2,0.542-23.727,0.542-23.727c2.381,3.705,2.29,10.245,2.29,10.245 c-0.378,6.859,5.541,17.342,5.541,17.342c2.844,4.332,3.921,8.442,3.921,8.747c0,1.248-0.273,4.269-0.273,4.269l0.109,2.631 c0.049,0.67,0.426,2.977,0.365,4.092c-0.444,6.862,0.646,5.571,0.646,5.571c0.92,0,1.931-5.522,1.931-5.522 c0,1.424-0.348,5.687,0.42,7.295c0.919,1.918,1.595-0.329,1.607-0.78c0.243-8.737,0.768-6.448,0.768-6.448 c0.511,7.088,1.139,8.689,2.265,8.135c0.853-0.407,0.073-8.506,0.073-8.506c1.461,4.811,2.569,5.577,2.569,5.577 c2.411,1.693,0.92-2.983,0.585-3.909c-1.784-4.92-1.839-6.625-1.839-6.625c2.229,4.421,3.909,4.257,3.909,4.257 c2.174-0.694-1.9-6.954-4.287-9.953c-1.218-1.528-2.789-3.574-3.245-4.789c-0.743-2.058-1.304-8.674-1.304-8.674 c-0.225-7.807-2.155-11.198-2.155-11.198c-3.3-5.282-3.921-15.135-3.921-15.135l-0.146-16.635 c-1.157-11.347-9.518-11.429-9.518-11.429c-8.451-1.258-9.627-3.988-9.627-3.988c-1.79-2.576-0.767-7.514-0.767-7.514 c1.485-1.208,2.058-4.415,2.058-4.415c2.466-1.891,2.345-4.658,1.206-4.628c-0.914,0.024-0.707-0.733-0.707-0.733 C115.068,0.636,104.01,0,104.01,0h-1.688c0,0-11.063,0.636-9.523,13.089c0,0,0.207,0.758-0.715,0.733 c-1.136-0.03-1.242,2.737,1.215,4.628c0,0,0.572,3.206,2.058,4.415c0,0,1.023,4.938-0.767,7.514c0,0-1.172,2.73-9.627,3.988 c0,0-8.375,0.082-9.514,11.429l-0.158,16.635c0,0-0.609,9.853-3.922,15.135c0,0-1.921,3.392-2.143,11.198 c0,0-0.563,6.616-1.303,8.674c-0.451,1.209-2.021,3.255-3.249,4.789c-2.408,2.993-6.455,9.24-4.29,9.953 c0,0,1.689,0.164,3.909-4.257c0,0-0.046,1.693-1.827,6.625c-0.35,0.914-1.839,5.59,0.573,3.909c0,0,1.117-0.767,2.569-5.577 c0,0-0.779,8.099,0.088,8.506c1.133,0.555,1.751-1.047,2.262-8.135c0,0,0.524-2.289,0.767,6.448 c0.012,0.451,0.673,2.698,1.596,0.78c0.779-1.608,0.429-5.864,0.429-7.295c0,0,0.999,5.522,1.933,5.522 c0,0,1.099,1.291,0.648-5.571c-0.073-1.121,0.32-3.422,0.369-4.092l0.106-2.631c0,0-0.274-3.014-0.274-4.269 c0-0.311,1.078-4.415,3.921-8.747c0,0,5.913-10.488,5.532-17.342c0,0-0.082-6.54,2.299-10.245c0,0,1.69,18.526,0.545,23.727 c0,0-5.319,12.778-4.146,22.308c0.864,7.094,2.53,22.237,4.226,28.217c0.886,3.094,0.362,10.899,1.072,12.848 c0.32,0.847,0.152,1.627-0.536,3.545c-2.387,6.71-2.083,11.436,3.921,29.24c0,0,1.848,3.945,0.914,11.033 c0,0-3.836,7.892-1.379,8.05c0,0,0.192,0.523,1.023,0.109c0,0,1.327,1.37,2.761,0.627c0,0,1.328,1.06,2.463,0.116 c0,0,0.91,1.047,2.237,0.201c0,0,1.742,1.175,2.777-0.098c0,0,1.839,0.408-1.435-7.886c0,0-1.254-8.793-1.945-10.522 c-1.318-3.275-0.387-12.251-0.106-14.175c0.453-3.216,0.21-8.695-0.618-12.934c-0.606-3.038,1.035-8.774,1.641-12.3 c1.245-7.423,3.685-26.373,3.38-29.959l1.008,0.354C103.809,118.312,104.265,117.959,104.265,117.959z"
          fill={getLiquidColor()}
          stroke="#000"
          strokeWidth="3"
        />

        {/* Liquid Fill */}
        <Defs>
          <LinearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={getLiquidColor()} stopOpacity="1" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
          </LinearGradient>
        </Defs>

        {/* Animated Liquid Fill */}
        <AnimatedRect
          x="50"
          y="0"
          width="100"
          animatedProps={animatedProps} // Apply the animated props here
          fill="url(#liquidGradient)"
          rx="20"
        />
      </Svg>

      <Text style={styles.percentageText}> {score}%</Text>
   
      
      {/* Celebration Animation */}
      {showCelebration && (
        <LottieView
          source={require('../../../assets/anm.json')} 
          autoPlay
          loop={true}
          style={styles.lottie}
        />
      )}

{showlib && <TouchableOpacity onPress={handleRewardPress} style={styles.rewardButton}>
      <Text style={styles.buttonText}>Liberate ^</Text>
      </TouchableOpacity>}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'black',
  },
  svg: {
    width: 200,
    height: 250,
    marginBottom:50,
  
  },
  percentageText: {
    fontSize: 24,
    color:'white',
  },
  rewardButton: {
    margin:5,
    marginBottom:70,
    backgroundColor: '#6a11cb', // Main button color (purple gradient start)
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12, // Rounded corners
    shadowColor: '#000', // Black shadow for depth
    shadowOffset: { width: 0, height: 8 }, // Shadow offset for depth
    shadowOpacity: 0.3, // Slight transparency for shadow
    shadowRadius: 10, // Blurred shadow for soft edges
    elevation: 10, // Android shadow
    borderWidth: 1, // Outer border
    borderColor: '#2575fc', // Complementary color (blue gradient end)
    transform: [{ translateY: -2 }], // Slight "raised" effect for 3D
    overflow: 'hidden', // Prevent gradient overflow
  },
  
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', // Text color
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Subtle text shadow
    textShadowOffset: { width: 2, height: 2 }, // Shadow direction for 3D text
    textShadowRadius: 3, // Slightly blurred shadow
    letterSpacing: 1.2, // Improve readability
    textTransform: 'uppercase', // Optional for emphasis
  },
  lottie: {
    width: 500,
    height: 700,
    marginBottom: 500,
  },
  liberationscore: {
    fontSize: 9,
    marginBottom: 60,
    color:'white',
    marginLeft:220,

  }
});

export default AnatomyIcon;
