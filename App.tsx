import React, { useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './src/Home';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { StatusBar } from 'react-native';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const onToggleButton = () => {
    setDarkMode(!darkMode);
  };

  const theme = darkMode ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <Home themeChange={onToggleButton} darkMode={darkMode} />
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
