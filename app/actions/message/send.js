import { v1 as uuid } from 'node-uuid'

export const MESSAGE_SEND_SUCCESS = 'MESSAGE_SEND_SUCCESS'
export const MESSAGE_SEND_FAIL = 'MESSAGE_SEND_FAIL'

export function sendMessage(team, id, message) {
  return async(dispatch, getState) => {
    const sendingID = uuid()
    try {
      dispatch({ type: MESSAGE_SEND_SUCCESS, payload: {
        team,
        id,
        message: await global._teams[team].message.send(id, {text: message, sendingID}),
        sendingID
      } })
    } catch (err) {
      console.error(err)
      dispatch({ type: MESSAGE_SEND_FAIL, payload: { team, id, sendingID, err } })
    }
  }
}
