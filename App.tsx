import { createContext, useContext, useState, ReactNode } from 'react';
import { themes, Theme } from './theme';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { NavigationContainer, useNavigation, ParamListBase } from '@react-navigation/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';

const Stack = createNativeStackNavigator();
const API_BASE_URL = 'http://localhost:3000'; // For a physical phone, replace localhost with your Mac's local IP address.

const ThemeContext = createContext<Theme | undefined>(undefined);

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used within a ThemeProvider');
  return theme;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <ThemeContext.Provider value={themes.light}>{children}</ThemeContext.Provider>
);

function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.homeContent}>
        <Text style={styles.homeTitle}>Wardrobe Maker</Text>
        <Text style={styles.subtitle}>Your personal style assistant</Text>
        {[
          ['Your Clothing', 'Clothing'],
          ['Your Outfits', 'Outfits'],
          ['Create New Outfit', 'Create New Outfit'],
          ['AI Wardrobe Advice', 'AI Wardrobe Helper'],
          ['AI Preview', 'AI Preview'],
          ['Settings', 'Settings'],
        ].map(([label, screen]) => (
          <Pressable key={screen} style={styles.menuButton} onPress={() => navigation.navigate(screen)}>
            <Text style={styles.menuButtonText}>{label}</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

function ClothingScreen() {
  return <View style={styles.content}><Text style={styles.title}>Clothing Screen</Text><Text>Your team's clothing screen can stay here.</Text></View>;
}
function OutfitsScreen() {
  return <View style={styles.content}><Text style={styles.title}>Outfits Screen</Text><Text>Your team's outfits screen can stay here.</Text></View>;
}
function CreateNewOutfitScreen() {
  return <View style={styles.content}><Text style={styles.title}>Create New Outfit Screen</Text></View>;
}
function SettingsScreen() {
  return <View style={styles.content}><Text style={styles.title}>Settings Screen</Text></View>;
}

type ChatMessage = { role: 'user' | 'assistant'; text: string };

function AIWardrobeHelperScreen() {
  const [message, setMessage] = useState('');
  const [wardrobe, setWardrobe] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Hi! Tell me what you own and where you are going. I can suggest outfits from your wardrobe and recommend pieces you might want to add.' },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const question = message.trim();
    if (!question || loading) return;
    setMessage('');
    setMessages((old) => [...old, { role: 'user', text: question }]);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, wardrobeItems: wardrobe.split(',').map((item) => item.trim()).filter(Boolean) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not get advice.');
      setMessages((old) => [...old, { role: 'assistant', text: data.reply }]);
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Unknown error';
      setMessages((old) => [...old, { role: 'assistant', text: `I couldn't connect to the AI service. ${reason}\n\nCheck that the backend is running and API_BASE_URL is correct.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.screen}>
        <Text style={styles.title}>AI Wardrobe Advice</Text>
        <Text style={styles.subtitle}>Outfits from your closet plus ideas for what to buy.</Text>
        <Text style={styles.fieldLabel}>What clothes do you own? (separate items with commas)</Text>
        <TextInput
          style={styles.wardrobeInput}
          value={wardrobe}
          onChangeText={setWardrobe}
          placeholder="Black jeans, white T-shirt, denim jacket, sneakers"
          multiline
        />
        <ScrollView style={styles.chat} contentContainerStyle={styles.chatContent}>
          {messages.map((item, index) => (
            <View key={`${item.role}-${index}`} style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={styles.bubbleLabel}>{item.role === 'user' ? 'You' : 'Wardrobe AI'}</Text>
              <Text style={styles.bubbleText}>{item.text}</Text>
            </View>
          ))}
          {loading && <ActivityIndicator style={styles.loader} size="small" color="#6C5CE7" />}
        </ScrollView>
        <View style={styles.composer}>
          <TextInput style={styles.messageInput} value={message} onChangeText={setMessage} placeholder="Ask for an outfit idea..." multiline />
          <Pressable style={[styles.sendButton, loading && styles.disabledButton]} onPress={sendMessage} disabled={loading}>
            <Text style={styles.sendButtonText}>{loading ? '...' : 'Send'}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function AIPreviewScreen() {
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [outfit, setOutfit] = useState('A casual outfit with a white T-shirt, dark jeans, and clean sneakers');
  const [loading, setLoading] = useState(false);

  const choosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photo permission needed', 'Allow photo library access to choose a picture for your outfit preview.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      base64: true,
      quality: 0.65,
    });
    if (result.canceled || !result.assets?.[0]?.base64) return;
    const asset = result.assets[0];
    setPhotoDataUrl(`data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`);
    setPreviewDataUrl(null);
  };

  const generatePreview = async () => {
    if (!photoDataUrl) {
      Alert.alert('Choose a photo', 'Select a photo before generating your outfit preview.');
      return;
    }
    if (!outfit.trim()) {
      Alert.alert('Describe the outfit', 'Enter the outfit you want to preview.');
      return;
    }
    setLoading(true);
    setPreviewDataUrl(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoDataUrl, outfit: outfit.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not generate the preview.');
      setPreviewDataUrl(`data:image/png;base64,${data.imageBase64}`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Preview failed', `${reason}\n\nCheck that the backend is running and API_BASE_URL is correct.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.previewContent}>
      <Text style={styles.title}>AI Preview</Text>
      <Text style={styles.subtitle}>Upload a photo and describe an outfit to create a visual preview.</Text>
      <Pressable style={styles.secondaryButton} onPress={choosePhoto}><Text style={styles.secondaryButtonText}>Choose My Photo</Text></Pressable>
      {photoDataUrl && <Image source={{ uri: photoDataUrl }} style={styles.previewImage} resizeMode="contain" />}
      <Text style={styles.fieldLabel}>Outfit to preview</Text>
      <TextInput style={styles.outfitInput} value={outfit} onChangeText={setOutfit} multiline placeholder="Describe an outfit..." />
      <Pressable style={[styles.primaryButton, loading && styles.disabledButton]} onPress={generatePreview} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Generate Outfit Preview</Text>}
      </Pressable>
      {previewDataUrl && <><Text style={styles.fieldLabel}>Generated preview</Text><Image source={{ uri: previewDataUrl }} style={styles.previewImage} resizeMode="contain" /></>}
      <Text style={styles.disclaimer}>AI previews are visual estimates. Clothing fit, colors, and details may not be exact. Only upload a photo you have permission to use.</Text>
    </ScrollView>
  );
}

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Clothing" component={ClothingScreen} />
      <Stack.Screen name="Outfits" component={OutfitsScreen} />
      <Stack.Screen name="Create New Outfit" component={CreateNewOutfitScreen} />
      <Stack.Screen name="AI Wardrobe Helper" component={AIWardrobeHelperScreen} options={{ title: 'AI Wardrobe Advice' }} />
      <Stack.Screen name="AI Preview" component={AIPreviewScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return <SafeAreaProvider><NavigationContainer><MyStack /></NavigationContainer></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  homeContent: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#FFFFFF' },
  homeTitle: { fontSize: 30, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  content: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
  screen: { flex: 1, padding: 16, backgroundColor: '#FFFFFF' },
  title: { fontSize: 25, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B6B6B', marginBottom: 16 },
  menuButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F5F5F7', padding: 17, borderRadius: 12, marginTop: 10 },
  menuButtonText: { color: '#1A1A1A', fontSize: 16, fontWeight: '600' },
  chevron: { fontSize: 24, color: '#6C5CE7' },
  fieldLabel: { color: '#1A1A1A', fontWeight: '700', marginBottom: 7, marginTop: 8 },
  wardrobeInput: { minHeight: 58, maxHeight: 90, borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 10, padding: 10, color: '#1A1A1A', marginBottom: 10 },
  chat: { flex: 1 },
  chatContent: { paddingVertical: 8, gap: 10 },
  bubble: { maxWidth: '92%', padding: 12, borderRadius: 14 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#6C5CE7' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#F1F0F8' },
  bubbleLabel: { fontWeight: '700', fontSize: 11, marginBottom: 4, color: '#6B6B6B' },
  bubbleText: { fontSize: 15, lineHeight: 21, color: '#1A1A1A' },
  loader: { margin: 10, alignSelf: 'flex-start' },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#E5E5EA' },
  messageInput: { flex: 1, maxHeight: 100, minHeight: 44, borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#1A1A1A' },
  sendButton: { backgroundColor: '#6C5CE7', paddingHorizontal: 17, paddingVertical: 13, borderRadius: 12 },
  sendButtonText: { color: '#FFFFFF', fontWeight: '700' },
  disabledButton: { opacity: 0.6 },
  previewContent: { paddingBottom: 30 },
  secondaryButton: { borderWidth: 1, borderColor: '#6C5CE7', borderRadius: 12, padding: 14, alignItems: 'center', marginVertical: 10 },
  secondaryButtonText: { color: '#6C5CE7', fontWeight: '700' },
  primaryButton: { backgroundColor: '#6C5CE7', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 12 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '700' },
  outfitInput: { minHeight: 90, borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 10, padding: 12, textAlignVertical: 'top', color: '#1A1A1A' },
  previewImage: { width: '100%', height: 340, backgroundColor: '#F5F5F7', borderRadius: 12, marginVertical: 12 },
  disclaimer: { fontSize: 12, lineHeight: 18, color: '#6B6B6B', marginTop: 16 },
});
