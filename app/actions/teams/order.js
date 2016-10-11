export const TEAMS_REORDER = 'TEAMS_REORDER'

export function teamsReorder(order) {
  return { type: TEAMS_REORDER, payload: order }
}
