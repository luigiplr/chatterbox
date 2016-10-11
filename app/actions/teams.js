export const TEAMS_SWITCH = 'TEAMS_SWITCH'
export const TEAMS_REORDER = 'TEAMS_REORDER'

export function teamsReorder(order) {
  return { type: TEAMS_REORDER, payload: order }
}

export function teamsSwitch(id) {
  return { type: TEAMS_SWITCH, payload: id }
}


export function loadTeams() {
  return dispatch => {

  }
}
