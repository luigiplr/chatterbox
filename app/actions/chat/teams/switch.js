export const TEAMS_SWITCH = 'TEAMS_SWITCH'

export function teamsSwitch(id) {
  return { type: TEAMS_SWITCH, payload: id }
}
