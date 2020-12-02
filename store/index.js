import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'
import axios from 'axios'

const initialState = {
  board: [],
  difficulty: 'easy',
  currentUser: 'Player',
  score: []
}

export const setBoard = (difficulty) => {
  return (dispatch) => {
    fetch(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        dispatch({type: 'SET_BOARD', payload: data.board})
      })
      .catch(err => {
        console.log(err);
      })
  }
}

export const setCurrentUser = (username) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_USER',
      payload: username
    })
  }
}

export const addScore = (score) => {
  return (dispatch) => {
    dispatch({
      type: 'ADD_SCORE',
      payload: score
    })
  }
}

const reducer = (state = initialState, action) => {
  if (action.type === 'SET_BOARD') {
    let newBoard = action.payload
    return { ...state, board: newBoard}
  }
  if (action.type === 'SET_DIFFICUTLY') {
    let newDifficulty = action.payload
    return { ...state, difficulty: newDifficulty}
  }
  if (action.type === 'SET_USER') {
    let newUser = action.payload
    return { ...state, currentUser: newUser}
  }
  if (action.type === 'ADD_SCORE') {
    let newScore = action.payload
    return { ...state.score, newScore}
  }

  return state
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk))) 

export default store