import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import "react-native-gesture-handler";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddChat from './screens/AddChatScreen';
import ChatScreen from './screens/ChatScreen';
import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc0U5rcnh4oiWhFiaQrMeuWLh9SlEmvVM",
  authDomain: "signal-clone-b192a.firebaseapp.com",
  projectId: "signal-clone-b192a",
  storageBucket: "signal-clone-b192a.appspot.com",
  messagingSenderId: "140855240872",
  appId: "1:140855240872:web:33f44ab1691aae8bb3fa9d",
};
const app = initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator()
const globalScreenOptions = {
  headerStyle: { backgroundColor: '#2C6BED' },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white"
}

export default function App() {


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <NavigationContainer>
        <StatusBar style='light' />
        <Stack.Navigator screenOptions={globalScreenOptions}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddChat" component={AddChat} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

});
