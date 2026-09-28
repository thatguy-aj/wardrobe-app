import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const features = [
  'Your Clothing',
  'Your Outfits',
  'Create New Outfit',
  'AI Wardrobe Helper'
];

export default function App() {
  const [selected, setSelected] = useState('Your Clothing');

  const handleSelect = (feature: string) => {
    setSelected(feature);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Wardrobe Helper</Text>
      <Text>Selected: {selected}</Text>
      <StatusBar style="auto" />
      <View style={styles.toolbar}>
        {features.map((feature) => (
          <Pressable key={feature} onPress={() => handleSelect(feature)}>
            <Text>{feature}</Text>
          </Pressable>
        ))}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
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
