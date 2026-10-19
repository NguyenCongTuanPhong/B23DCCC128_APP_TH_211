import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StudentProvider } from './src/context/StudentContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <StudentProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </StudentProvider>
    </SafeAreaProvider>
  );
}

export default App;
