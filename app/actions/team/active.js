export const TEAM_FOCUSED_CHANNEL_OR_DM_CHANGE = 'TEAM_FOCUSED_CHANNEL_OR_DM_CHANGE'
export const TEAM_FOCUSED_CHANGE = 'TEAM_FOCUSED_CHANGE'

export function changeFocusedTeam(teamID) {
  return { type: TEAM_FOCUSED_CHANGE, payload: teamID }
}

export function changeTeamFocusedChannelOrDM(team, channel_or_id) {
  return { type: TEAM_FOCUSED_CHANNEL_OR_DM_CHANGE, payload: { team, id: channel_or_id } }
}
