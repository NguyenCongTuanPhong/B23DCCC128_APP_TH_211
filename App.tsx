import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { OfflineBanner } from './src/components/OfflineBanner';
import { StudentProvider } from './src/context/StudentContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Colors } from './src/theme/colors';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <StudentProvider>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <OfflineBanner />
          <View style={styles.container}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </View>
        </SafeAreaView>
      </StudentProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default App;