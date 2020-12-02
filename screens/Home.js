import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../store/'

export default function Home({ navigation }) {
  const [username, setUsername] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const currentUser = useSelector((state) => state.currentUser)
  const dispatch = useDispatch()

  const enterGame = () => {
    dispatch(setCurrentUser(username.text))
    setUsername('')
    navigation.navigate('Game', {
      difficulty: difficulty
    })
  }
  
  return (
    <View style={styles.container}>
      <Text>Enter your username</Text>

      <TextInput style={styles.inputName} onChangeText={text => setUsername({ text })} placeholder="i.e. Skittlz"></TextInput>
      <Picker
        selectedValue={difficulty}
        style={{ height: 50, width: 100}}      
        onValueChange={(itemValue, itemIndex) => setDifficulty(itemValue)}
      >
        <Picker.Item label="Easy" value="easy"/>
        <Picker.Item label="Medium" value="medium"/>
        <Picker.Item label="Hard" value="hard"/>
      </Picker>

      <Button title="Play Game" onPress={enterGame}></Button>
      {/* <Text>Default Username: {currentUser}</Text> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
  },
  inputName: {
      minHeight: 40,
      borderBottomColor: '#000000',
      borderBottomWidth: 1
  }
})