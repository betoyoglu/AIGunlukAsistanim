import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DailyEntryScreen from './src/screens/DailyEntryScreen';

const App = () => {
  return (
    <SafeAreaProvider>
      <DailyEntryScreen />
    </SafeAreaProvider>
  );
};

export default App;