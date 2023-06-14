import React from 'react';
import { Button, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SafeAreaView from 'react-native-safe-area-view';
import TextBox from './components/TextBox';

interface Props {
  themeChange: () => void;
  darkMode: boolean;
}

const Home: React.FC<Props> = ({ themeChange, darkMode }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ ...Styles.container, backgroundColor: theme.colors.background }}>
      <View style={Styles.viewStyle}>
        <Button onPress={themeChange} style={Styles.buttonStyle}>
          <Icon name={darkMode ? 'sun' : 'moon'} size={20} color={theme.colors.primary} />
        </Button>
      </View>

      <TextBox darkMode={darkMode} />
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewStyle: {
    zIndex: 10,
    width: '100%',
  },
  buttonStyle: {
    position: 'absolute',
    top: 20,
    right: 10,
  },
});

export default Home;
