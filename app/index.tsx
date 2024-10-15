import { StyleSheet, View } from 'react-native';
import { ShoppingListItem } from '../components/ShoppingListItem';


export default function App() {
  
  return (
    <View style={styles.container}>
      <ShoppingListItem name='coffee' isCompleted={true}/>
      <ShoppingListItem name='tea'/>
      <ShoppingListItem name='sugar'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
