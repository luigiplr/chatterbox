import { combineReducers } from 'redux'
import messages from './messages'
import team from './team'
import teams from './teams'

export default combineReducers({
  messages,
  team,
  teams
})
