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
import Toast from 'react-native-toast-message';

export async function listQuiz() {
  const response = await requestQuiz();

  const dados = response.map((quiz: any) => {
    return {
      id: quiz.id,
      english: quiz.english,
      portugues: quiz.portugues,
      acertos: quiz.acertos,
      pronuncia: quiz.pronuncia,
      traducao: quiz.traducao,
      portugues_alternativas: quiz.portugues_alternativas,
    };
  });
  return dados;
}

export default function Home() {
  const [quiz, setQuiz] = useState<any>(null);
  const [reload, setReload] = useState(false); // Estado para controle de recarregamento
  const [sound, setSound] = useState<any>();
  const [audioPathMap, setAudioPathMap] = useState<{ [key: string]: string }>({});
  const [clickedAlternatives, setClickedAlternatives] = useState<string[]>([]);
  const [clickedIndices, setClickedIndices] = useState<number[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await requestQuiz();
      setQuiz(response);
    };

    const fetchAudioPaths = async () => {
      try {
        const response = await axios.get('http://javeiro.com.br:8081/questions/words');
        setAudioPathMap(response.data);
      } catch (error) {
        console.error('Error fetching audio paths', error);
      }
    };

    fetchQuiz();
    fetchAudioPaths();
  }, [reload]); // Adiciona reload como dependência

  
  const handlePress = (alternativaSelecionada: string, index: number) => {
    if (alternativaSelecionada === quiz?.[0]?.portugues) {
      setClickedAlternatives(prev => [...prev, alternativaSelecionada]);
      setClickedIndices([...clickedIndices, index]);
    } else {
      setClickedAlternatives(prev => [...prev, alternativaSelecionada]);
      setClickedIndices([...clickedIndices, index]);
    }
  };

  const verificandoFrase = (frase: string) => {
    if(frase === quiz?.[0]?.traducao){
      requestQuizUpdate(quiz?.[0]?.id, quiz?.[0]?.portugues);
      setReload(!reload);
      setClickedAlternatives([]);
      setClickedIndices([]);
    }else{
      requestQuizUpdate(quiz?.[0]?.id, frase);
      Alert.alert('Incorreto!', '\nEnglish: ' + quiz?.[0]?.pronuncia + '\n\nPortugues: ' + quiz?.[0]?.traducao);
      setReload(!reload);
      setClickedAlternatives([]);
      setClickedIndices([]);
    }
  }

  async function playSound(audio: string) {
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
          <Text style={styles.subtitle}>Frase: {quiz?.[0]?.pronuncia}</Text>
          <Text style={styles.frase}>
            {clickedAlternatives.length > 0 ? clickedAlternatives.join(' ') : 'Traduza a frase acima'}
          </Text>
          {(!quiz || quiz.length === 0) && (
            <Text style={styles.title}>Parabéns você concluiu o Quiz!</Text>
          )}
        </View>
        <View style={styles.form}>
            {quiz?.[0]?.portugues_alternativas.map((alternativa: string, index: number) => (
              !clickedIndices.includes(index) && (
                <TouchableOpacity key={index} onPress={() => handlePress(alternativa, index)}>
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>{alternativa}</Text>
                  </View>
                </TouchableOpacity>
              )
            ))}
          </View>

          <View>
            <TouchableOpacity onPress={() => verificandoFrase(clickedAlternatives.join(' '))}>
              <Text style={styles.botaoEnviar}>Responder</Text>
            </TouchableOpacity>
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

  form: {
      //marginBottom: 24,
      backgroundColor: '#ececec',
      display: 'flex',
      flexWrap: 'wrap',
      padding: 10,
      height: '50%', // ou um valor específico como '500px'
      borderRadius: 8,
  },

  frase: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00711c',
    marginBottom: 6,
    textAlign: 'center',
  },
    
  btn: {
    padding: 10,
    paddingEnd: 10,
    marginBottom: 10, 
    marginLeft: 3,          
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#838383',
    
  },
  
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff',
  },

  botaoEnviar: {
    marginTop: 20,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#f4511e',
    padding: 10,
    paddingEnd: 10,
    marginBottom: 10, 
    marginLeft: 3,          
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    textAlign: 'center',
  },


});