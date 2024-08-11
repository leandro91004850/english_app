import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function Profile() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>Profile Screen 2 camada</Text>
      <Text>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
