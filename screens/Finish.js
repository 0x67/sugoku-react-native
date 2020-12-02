import React from 'react'
import { View, Button, Text, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'

export default function Finish({ navigation }) {
  const score = useSelector((state) => state.score)

  const compare = (a, b) => {
    const userA = a.score
    const userB = b.score

    let compareValue = 0
    if (userA < userB) {
      compareValue = 1
    } else if (userA > userB) {
      compareValue = -1
    }

    return compareValue
  }

  score.sort(compare)

  return (
    <View style={styles.container}>
      <Text>Leaderboards: </Text>
      {score.map(userScore => {
        return (
          <View>
            <Text>Username: {userScore.user}</Text>
            <Text>Score: {userScore.score}</Text>
          </View>
        )
      })}
      <Button title="Play Again" onPress={() => navigation.navigate('Home')}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})