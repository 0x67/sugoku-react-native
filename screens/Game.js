import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, TextInput, Button, Alert } from 'react-native'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setBoard, addScore } from '../store/'

export default function Game ({ route, navigation }) {
  const { difficulty } = route.params
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.currentUser)
  const board = useSelector((state) => state.board)
  const [userResult, setUserResult] = useState(board)
  const [time, setTime] = useState()
  
  const encodeBoard = (board) => {
    board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`), ''
  }

  const encodeParams = (params) => {
    Object.keys(params)
      .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
      .join('&')
  }

  const onChangeInput = (indexI, indexJ, value) => {
    let newBoard = userResult
    newBoard[indexI][indexJ] = +value
    setUserResult(newBoard)
  }

  const solveSudoku = () => {
    const data = { board }
    fetch('https://sugoku.herokuapp.com/solve', {
      method: 'POST',
      body: encodeParams(data),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        setUserResult(res.solution)
      })
      .catch(err => {
        console.log(err);
      })
  }

  const checkSudoku = () => {
    const data = { board }

    fetch('https://sugoku.herokuapp.com/validate', {
      method: 'POST',
      body: encodeParams(data),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then(res => res.json())
      .then(res => {
        if(res.status === 'solved') {
          Alert.alert(
            'Congrats!',
            'You solved it',
            [{
              text: 'OK',
              onPress: () => navigation.navigate('Finish')
            }],
            { cancelable: false}
          )
        } else {
          Alert.alert(
            "Board still unsolved",
            'Better luck next time',
            [{
              text: 'OK',
              onPress: () => navigation.navigate('Finish')
            }],
            { cancelable: false}
          )
        }
      })
      .catch(err => {
        console.log(err);
      })
  }
  useEffect(() => {
    if(difficulty === 'easy') {
      setTime(500)
    } else if (difficulty === 'medium') {
      setTime(750)
    } else if (difficulty === 'hard') {
      setTime(1000)
    }
    dispatch(setBoard(difficulty))
    setUserResult(JSON.parse(JSON.stringify(board)))
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (time > 1) {
        setTime(time - 1)
      } else if (time == 1) {
        const data = { board: userResult}
        window.clearTimeout()
        dispatch(addScore({
          user: currentUser || 'Player',
          score: time
        }))

        fetch('https://sugoku.herokuapp.com/validate', {
          method: 'POST',
          body: encodeParams(data),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
          .then(res => res.json())
          .then(res => {
            if(res.status === 'solved') {
              Alert.alert(
                'Congrats!',
                'You solved it',
                [{
                  text: 'OK',
                  onPress: () => navigation.navigate('Finish')
                }],
                { cancelable: false}
              )
            } else {
              Alert.alert(
                "Time's up!",
                'GL next game',
                [{
                  text: 'OK',
                  onPress: () => navigation.navigate('Finish')
                }],
                { cancelable: false}
              )
            }
          })
          .catch(err => {
            console.log(err);
          })
      }
    }, 1000)
  })

  return (
    <View style={styles.container}>
      <Text>Player: {currentUser}. Difficulty: {difficulty}</Text>
      
      {userResult ? (
        <FlatList
            data={userResult}
            renderItem={({ item, index }) => {
                return (
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            borderColor: 'gray',
                            borderWidth: 1
                        }}
                    >
                        {item.map((inputBoard, indexJ) => {
                            return inputBoard == 0 ? (
                                <TextInput
                                    style={textInputStyle}
                                    keyboardType={'numeric'}
                                    onChangeText={text =>
                                        onChangeInput(
                                            index,
                                            indexJ,
                                            text
                                        )
                                    }
                                    key={indexJ}
                                    defaultValue={''}
                                    maxLength={1}
                                />
                            ) : (
                                <TextInput
                                    style={{
                                        height: 40,
                                        borderColor: 'gray',
                                        borderWidth: 3,
                                        width: 40,
                                        textAlign: 'center',
                                        backgroundColor: 'green'
                                    }}
                                    keyboardType={'numeric'}
                                    onChangeText={text =>
                                        onChangeInput(
                                            index,
                                            indexJ,
                                            text
                                        )
                                    }
                                    defaultValue={String(inputBoard)}
                                    maxLength={1}
                                    editable={false}
                                />
                            )
                        })}
                    </View>
                )
            }}
            keyExtractor={item => item.id}
        ></FlatList>
      ) : (
          <Text> Generating Sudoku Board. Please wait ....</Text>
      )}

      <View style={{ marginBottom: 10 }}>
        <Text>{time}</Text>
        <Button title="Solve" onPress={solveSudoku}/>
        <Button title="Finish" onPress={checkSudoku}/>
        <Button title="Give Up" onPress={() => navigation.navigate('Finish')}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center'
  }
})

let textInputStyle = {
  height: 40,
  borderColor: 'gray',
  borderWidth: 3,
  width: 40,
  textAlign: 'center'
}