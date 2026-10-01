import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const features = [
  'Your Clothing',
  'Your Outfits',
  'Create New Outfit',
  'AI Wardrobe Helper'
];

function HomeScreen() {
  return (
    <View style={styles.content}>
      <Text>Home Screen</Text>
    </View>
  );
}

function ClothingScreen() {
  return (
    <View style={styles.content}>
      <Text>Clothing Screen</Text>
    </View>
  );
}

function OutfitsScreen() {
  return (
    <View style={styles.content}>
      <Text>Outfits Screen</Text>
    </View>
  );
}

function CreateNewOutfitScreen() {
  return (
    <View style={styles.content}>
      <Text>Create New Outfit Screen</Text>
    </View>
  );
}

function AIWardrobeHelperScreen() {
  return (
    <View style={styles.content}>
      <Text>AI Wardrobe Helper Screen</Text>
    </View>
  );
}

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Clothing" component={ClothingScreen} />
      <Stack.Screen name="Outfits" component={OutfitsScreen} />
      <Stack.Screen name="Create New Outfit" component={CreateNewOutfitScreen} />
      <Stack.Screen name="AI Wardrobe Helper" component={AIWardrobeHelperScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [selected, setSelected] = useState('Home Screen');

  return ( 
    /**
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.content}>
          <Text style={styles.title}>Wardrobe Helper</Text>
          <Text>Selected: {selected}</Text>
          <View style={styles.toolbar}>
            {features.map((feature) => (
              <Pressable key={feature} onPress={() => setSelected(feature)}>
                <Text>{feature}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
    */
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 'auto',
  }
});
