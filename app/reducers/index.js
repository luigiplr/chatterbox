import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import messages from './messages'
import team from './team'
import teams from './teams'

export default combineReducers({
  teams,
  team,
  messages,
  routing
})
