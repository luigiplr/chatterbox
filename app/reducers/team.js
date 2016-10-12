import { TEAM_FOCUSED_CHANNEL_OR_DM_CHANGE, TEAM_FOCUSED_CHANGE } from 'actions/team/active'

const DEFAULT_STATE = {
  focusedChannelOrDM: {},
  focusedTeam: null
}

export default function team(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case TEAM_FOCUSED_CHANGE:
      return {...state, focusedTeam: payload }
    case TEAM_FOCUSED_CHANNEL_OR_DM_CHANGE:
      return {...state, focusedChannelOrDM: {...state.focusedChannelOrDM, [payload.team]: payload.id } }
    default:
      return state
  }
}
