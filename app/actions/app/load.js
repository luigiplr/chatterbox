import { loadTeams } from '../chat/teams/load'

export function appLoad() {
  return (dispatch, getState) => {
    dispatch(loadTeams())
  }
}
