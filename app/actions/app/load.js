import { loadTeams } from '../chat/teams/load'
import { setAppScreenResolution } from './screen'

export function appLoad() {
  return (dispatch, getState) => {
    dispatch(loadTeams())
    dispatch(setAppScreenResolution())
  }
}
