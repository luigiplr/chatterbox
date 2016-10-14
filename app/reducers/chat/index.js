import { combineReducers } from 'redux'
import messages from './messages'
import team from './team'
import teams from './teams'
import scroll from './scroll'

export default combineReducers({
  scroll,
  messages,
  team,
  teams
})
