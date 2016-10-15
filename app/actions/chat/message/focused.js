export const MESSAGE_FOCUSED_INDEX_CHANGE = 'MESSAGE_FOCUSED_INDEX_CHANGE'

export function changeFocusedMessageIndex(team, channelorDMID, index) {
  return { type: MESSAGE_FOCUSED_INDEX_CHANGE, payload: { index, team, channelorDMID } }
}
