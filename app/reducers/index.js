// @flow
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import message from './message'
import team from './team'
import teams from './teams'

export default combineReducers({
  teams,
  team,
  message,
  routing
})
