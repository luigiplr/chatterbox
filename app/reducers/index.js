import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import chat from './chat'

export default combineReducers({
  chat,
  routing
})
