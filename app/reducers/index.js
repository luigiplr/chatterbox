import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import chat from './chat'
import app from './app'

export default combineReducers({
  app,
  chat,
  routing
})
