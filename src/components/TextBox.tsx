import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, PermissionsAndroid } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Tts from 'react-native-tts';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';

interface Props {
  darkMode: boolean;
}

const TextBox: React.FC<Props> = ({ darkMode }) => {
  const [text, setText] = useState<string>('');
  const textRef = useRef<string>('');
  const [playing, setPlaying] = useState<boolean>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [recordingPermission, setRecordingPermission] = useState<boolean>(false);

  useEffect(() => {
    async function microphonePermission() {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: 'Text to Speech App Permission',
          message: 'Text to Speech App needs access to your microphone so you can speak to type the text.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setRecordingPermission(true);
        }
      } catch (err) {
        // console.log(err);
      }
    }

    Voice.onSpeechStart = () => {
      setSpeaking(true);
    };

    Voice.onSpeechResults = (event: SpeechResultsEvent) => {
      if (event.value) {
        textRef.current = textRef.current + ' ' + event.value[0];
        setText(textRef.current);
      }
    };

    Voice.onSpeechEnd = () => {
      setSpeaking(false);
    };

    microphonePermission();

    Tts.getInitStatus().then(
      () => {},
      (err) => {
        if (err.code === 'no_engine') {
          Tts.requestInstallEngine();
        }
      },
    );

    Tts.addEventListener('tts-start', () => setPlaying(true));
    Tts.addEventListener('tts-finish', () => setPlaying(false));
    Tts.addEventListener('tts-cancel', () => setPlaying(false));

    Tts.setDefaultRate(0.5);
    return () => {
      Tts.stop();
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
      Voice.removeAllListeners();
    };
  }, []);

  const startHearing = async () => {
    try {
      await Voice.start('en-US');
    } catch (err) {
      console.log(err);
    }
  };

  const startSpeaking = () => {
    if (playing) {
      Tts.stop();
      return;
    }

    if (text.length > 0) {
      Tts.speak(text);
    }
  };

  const inputTextHandler = (value: string) => {
    textRef.current = value;
    setText(value);
  };

  return (
    <View style={Styles.subContainer}>
      <TextInput
        mode="outlined"
        multiline={true}
        style={Styles.inputStyle}
        placeholder="Speak or enter your text here"
        onChangeText={inputTextHandler}
        value={text}
      />

      <View style={Styles.viewStyle}>
        <Button mode="elevated" dark={darkMode} style={Styles.buttonStyle} onPress={startHearing} disabled={recordingPermission}>
          {speaking ? (
            <>
              <Icon name="microphone-slash" size={15} /> {'  '} Speak
            </>
          ) : (
            <>
              <Icon name="microphone" size={15} /> {'  '} Speak
            </>
          )}
        </Button>
        <Button mode="elevated" dark={darkMode} style={Styles.buttonStyle} onPress={startSpeaking}>
          {playing ? (
            <>
              <Icon name="stop" size={15} /> {'  '} Stop
            </>
          ) : (
            <>
              <Icon name="play" size={15} /> {'  '} Listen
            </>
          )}
        </Button>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  subContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,
  },
  inputStyle: {
    height: 200,
    minWidth: '90%',
    width: '90%',
    maxHeight: 200,
  },
  viewStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  buttonStyle: {
    width: 140,
    padding: 4,
  },
});

export default TextBox;
