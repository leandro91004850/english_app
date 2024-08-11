import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        
      <Stack.Screen name="profile" options={{title: 'Perfil'}}/>
      <Stack.Screen name="index" options={{title: 'Home'}}/>
      <Stack.Screen name="user/index" options={{title: 'Usuário'}}/>
      <Stack.Screen name="user/profile" options={{title: 'Perfil do Usuário'}}/>
    </Stack>
  );
}
