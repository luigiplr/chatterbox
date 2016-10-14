import { forEach } from 'lodash'
import { getTeams } from 'lib/teams'
import providers from 'lib/providers'

export const TEAMS_LOAD = 'TEAMS_LOAD'
export const TEAMS_LOAD_SUCCESS = 'TEAMS_LOAD_SUCCESS'
export const TEAMS_LOAD_FAIL = 'TEAMS_LOAD_FAIL'

export function loadTeams() {
  return dispatch => {
    const teams = getTeams()
    forEach(teams, ({ type, ...team }, id) => {
      if (!global._teams[id]) {
        global._teams[id] = new providers[type](team, dispatch)
      } else {
        console.error(`${id} has already been initialized`)
      }
    })
  }
}
