import { createContext, useContext, useState, ReactNode } from 'react';
import { themes, Theme } from './theme';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { NavigationContainer, useNavigation, ParamListBase } from '@react-navigation/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const ThemeContext = createContext<Theme | undefined>(undefined);

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = themes.light; // Default to light theme, you can change this or make it dynamic
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

const features = [
  'Your Clothing',
  'Your Outfits',
  'Create New Outfit',
  'AI Wardrobe Helper'
];

function HomeScreen() {
  // Get the navigation object from the context
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  // Navigation functions for each feature
  // Maybe later move these out of the HomePage function and create separate navigation hooks 
  // so they are universal and we won't have to repeat them in each screen
  const goToClothing = () => navigation.navigate('Clothing');
  const goToOutfits = () => navigation.navigate('Outfits');
  const goToCreateNewOutfit = () => navigation.navigate('Create New Outfit');
  const goToAIWardrobeHelper = () => navigation.navigate('AI Wardrobe Helper');
  const goToSettings = () => navigation.navigate('Settings');
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.toolbar}>
          <Pressable onPress={goToClothing}>
            <Text>Clothing</Text>
          </Pressable>
          <Pressable onPress={goToOutfits}>
            <Text>Outfits</Text>
          </Pressable>
          <Pressable onPress={goToCreateNewOutfit}>
            <Text>Create New Outfit</Text>
          </Pressable>
          <Pressable onPress={goToAIWardrobeHelper}>
            <Text>AI Wardrobe Helper</Text>
          </Pressable>
          <Pressable onPress={goToSettings}>
            <Text>Settings</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
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

function SettingsScreen() {
  return (
    <View style={styles.content}>
      <Text>Settings Screen</Text>
    </View>
  );
}

// Stack navigator for the main screens
// Holds all the pages for the main navigation to refeance
function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Clothing" component={ClothingScreen} />
      <Stack.Screen name="Outfits" component={OutfitsScreen} />
      <Stack.Screen name="Create New Outfit" component={CreateNewOutfitScreen} />
      <Stack.Screen name="AI Wardrobe Helper" component={AIWardrobeHelperScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [selected, setSelected] = useState('Home Screen');

  return ( 
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
