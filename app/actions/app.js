import { loadTeams } from './teams/load'

export function appLoad() {
  return (dispatch, getState) => {
    dispatch(loadTeams())
  }
}
