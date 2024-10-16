import { useState } from 'react';
import { StyleSheet, TextInput, ScrollView ,FlatList, View,Text } from 'react-native';
import { ShoppingListItem } from '../components/ShoppingListItem';
import { theme } from '../theme';

type shoppingListItemType={
  id:string;
  name:string;
}

 
export default function App() {
  const [shoppingList,setShoppingList]=
  useState<shoppingListItemType[]>([])
  const [value,setValue]=useState("");
  const handleSubmit=()=>{
    if(value){
      const newShoppingList=[
        {id:new Date().toTimeString(), name: value},
        ...shoppingList
      ];
      setShoppingList(newShoppingList);
      setValue('');
    }
  }
  
  return (
    <FlatList
      data={shoppingList}
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
      ListEmptyComponent={
       < View style={styles.listEmptyContainer}>
        <Text>Your Shopping List is empty</Text>
       </View>
      }
      ListHeaderComponent={
        <TextInput 
        placeholder='E.g coffee' 
        style={styles.textInput}
        value={value}
        onChangeText={setValue}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
   }
      renderItem={({item})=>{
        return <ShoppingListItem name={item.name}/>

      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding:12,
  },
  contentContainer:{
    paddingBottom:24,
  },
  textInput:{
    borderColor:theme.colorLightGrey,
    borderWidth:2,
    padding:12,
    marginHorizontal:12,
    marginBottom:12,
    fontSize:18,
    borderRadius:50,
    backgroundColor:theme.colorWhite,

  },
  listEmptyContainer:{
    justifyContent:"center",
    alignItems:"center",
    marginVertical:18,
  }
});
