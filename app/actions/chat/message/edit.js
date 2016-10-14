export const MESSAGE_EDITED = 'MESSAGE_EDITED'
export const MESSAGE_EDIT = 'MESSAGE_EDIT'
export const MESSAGE_EDIT_SUCCESS = 'MESSAGE_EDIT_SUCCESS'
export const MESSAGE_EDIT_FAIL = 'MESSAGE_EDIT_FAIL'

export function editMessage(team, channelorDMID, message) {

}

export function messageEdited(team, channelorDMID, message, originalID) {
  return { type: MESSAGE_EDITED, payload: { team, channelorDMID, message, originalID } }
}
