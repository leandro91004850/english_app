import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { requestQuiz } from '@/api/requestQuiz';
import { requestQuizUpdate } from '@/api/requestQuizUpdate';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { fromByteArray } from 'base64-js';

export async function listQuiz() {
  const response = await requestQuiz();

  const dados = response.map((quiz: any) => {
    return {
      id: quiz.id,
      english: quiz.english,
      portugues: quiz.portugues,
      acertos: quiz.acertos,
      pronuncia: quiz.pronuncia,
      portugues_alternativas: quiz.portugues_alternativas,
    };
  });
  return dados;
}

export default function Home() {
  const [quiz, setQuiz] = useState<any>(null);
  const [reload, setReload] = useState(false); // Estado para controle de recarregamento
  const [sound, setSound] = useState<any>();

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await requestQuiz();
      setQuiz(response);
    };

    fetchQuiz();
  }, [reload]); // Adiciona reload como dependência

  const handlePress = (alternativaSelecionada: string) => {
    if (alternativaSelecionada === quiz?.[0]?.portugues) {
      // Ação para resposta correta
      requestQuizUpdate(quiz?.[0]?.id, alternativaSelecionada);
      Alert.alert('Correto!', 'A tradução da palavra ' + quiz?.[0]?.english + ' é ' + alternativaSelecionada);
      setReload(!reload); // Atualiza o estado para recarregar os dados
    } else {
      requestQuizUpdate(quiz?.[0]?.id, alternativaSelecionada);
      Alert.alert('Incorreto!', 'Ex: ' + quiz?.[0]?.pronuncia);
    }
  };

  async function playSound(audio: string) {
    const audioPathMap: { [key: string]: any } = {
        'mean': 'https://www.myinstants.com/media/sounds/hello-5.mp3',
        'same': 'https://www.myinstants.com/media/sounds/world.mp3',
        'which': 'https://www.myinstants.com/media/sounds/world.mp3',
        'above': 'https://www.myinstants.com/media/sounds/world.mp3',
    };

    if (!audioPathMap[audio]) {
        console.error('Invalid audio file: ' + audio);
        return;
    }

    let selectedAudio = audioPathMap[audio];
    const localUri = FileSystem.documentDirectory + audio + '.mp3';

    // Verifica se o arquivo já existe localmente
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (!fileInfo.exists) {
        try {
            console.log('Downloading Sound ' + audio);
            const response = await axios.get(selectedAudio, { responseType: 'arraybuffer' });
            const base64Audio = fromByteArray(new Uint8Array(response.data));
            await FileSystem.writeAsStringAsync(localUri, base64Audio, { encoding: FileSystem.EncodingType.Base64 });
            selectedAudio = localUri;
        } catch (error) {
            console.error('Error downloading sound', error);
            return;
        }
    } else {
        selectedAudio = localUri;
    }

    console.log('Loading Sound ' + selectedAudio);

    try {
        const { sound } = await Audio.Sound.createAsync({ uri: selectedAudio });
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    } catch (error) {
        console.error('Error loading or playing sound', error);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => playSound(quiz?.[0]?.english)}>
            <Text style={styles.title}>{quiz?.[0]?.english}</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle}>Qual a tradução correta abaixo?</Text>
          {(!quiz || quiz.length === 0) && (
            <Text style={styles.title}>Parabéns você concluiu o Quiz!</Text>
          )}
        </View>
        <View style={styles.form}>
          <View style={styles.formAction}></View>
          <View style={styles.formAction}>
            {quiz?.[0]?.portugues_alternativas.map((alternativa: string, index: number) => (
                <TouchableOpacity key={index} onPress={() => handlePress(alternativa)}>
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>{alternativa}</Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    marginVertical: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1d1d1d',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
    marginBottom: 10,
  },
  /** Form */
  form: {
    marginBottom: 24,
  },
  formAction: {
    marginVertical: 24,
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: '#007aff',
    borderColor: '#007aff',
    marginBottom: 10,
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff',
  },
});