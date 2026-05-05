import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import EcopontosScreen from './src/screens/EcopontosScreen';
import DetalheEcopontoScreen from './src/screens/DetalheEcopontoScreen';
import NovoEcopontoScreen from './src/screens/NovoEcopontoScreen';
import EditarEcopontoScreen from './src/screens/EditarEcopontoScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#2E7D32' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'EcoFilter' }}
        />
        <Stack.Screen
          name="Ecopontos"
          component={EcopontosScreen}
          options={{ title: 'Ecopontos' }}
        />
        <Stack.Screen
          name="DetalheEcoponto"
          component={DetalheEcopontoScreen}
          options={{ title: 'Detalhes' }}
        />
        <Stack.Screen
          name="NovoEcoponto"
          component={NovoEcopontoScreen}
          options={{ title: 'Novo Ecoponto' }}
        />
        <Stack.Screen
          name="EditarEcoponto"
          component={EditarEcopontoScreen}
          options={{ title: 'Editar Ecoponto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
