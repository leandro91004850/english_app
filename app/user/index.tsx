import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function User() {

    return (
       <View> 
            <Text>User</Text>
            <Link href={'./profile'}>Go to Profile</Link>
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
