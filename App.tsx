import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const features = [
  'Your Clothing',
  'Your Outfits',
  'Create New Outfit',
  'AI Wardrobe Helper'
];

export default function App() {
  const [selected, setSelected] = useState('Your Clothing');

  return (
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
