import { TEAM_FOCUSED_CHANNEL_OR_DM_CHANGE, TEAM_FOCUSED_CHANGE } from 'actions/team/active'

const DEFAULT_STATE = {
  focused: {},
  focusedChannelOrDM: {},
  focusedTeam: null
}

export default function team(state = {}, { type, payload }) {
  switch (type) {
    case TEAM_FOCUSED_CHANGE:
      return {...state, focusedTeam: payload }
    case TEAM_FOCUSED_CHANNEL_OR_DM_CHANGE:
      let { team, id } = payload
      return {...state, focused: {...state.focused, [team]: id }, focusedChannelOrDM: team === state.focusedTeam ? id : state.focusedChannelOrDM }
    default:
      return state
  }
}
