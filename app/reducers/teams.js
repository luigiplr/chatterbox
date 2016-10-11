import { combineReducers } from 'redux'
import { omit } from 'lodash'
import { TEAM_LOAD, TEAM_LOAD_SUCCESS } from 'actions/team/load'

function loaded(state = {}, { type, payload }) {
  switch (type) {
    case TEAM_LOAD_SUCCESS:
      let { team, ...rest } = payload
      return { ...state, [team.id]: rest }
    default:
      return state
  }
}

function loading(state = {}, { type, payload }) {
  switch (type) {
    case TEAM_LOAD:
      let { id, ...rest } = payload
      return { ...state, [id]: rest }
    case TEAM_LOAD_SUCCESS:
      return omit(state, payload.team.id)
    default:
      return state
  }
}

export default combineReducers({
  loaded,
  loading
})
