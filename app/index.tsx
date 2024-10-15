import { useState } from 'react';
import { StyleSheet, TextInput, ScrollView } from 'react-native';
import { ShoppingListItem } from '../components/ShoppingListItem';
import { theme } from '../theme';

type shoppingListItemType={
  id:string;
  name:string;
}
const initialList:shoppingListItemType[]=[
   {id:"1",name:"coffee"},
   {id:"2",name:"tea"},
   {id:"3",name:"sugar"},

  ]
export default function App() {
  const [shoppingList,setShoppingList]=
  useState<shoppingListItemType[]>(initialList)
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
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
    >
      <TextInput 
        placeholder='E.g coffee' 
        style={styles.textInput}
        value={value}
        onChangeText={setValue}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      {shoppingList.map(item=>(
        <ShoppingListItem name={item.name} key={item.id}/>
      ))}
    </ScrollView>
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

  }
});
