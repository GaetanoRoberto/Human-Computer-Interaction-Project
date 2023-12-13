import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// to run, npx expo start
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Lorem Ipsum</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
