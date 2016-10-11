export const MESSAGE_REMOVED = 'MESSAGE_REMOVED'
export const MESSAGE_REMOVE = 'MESSAGE_REMOVE'
export const MESSAGE_REMOVE_SUCCESS = 'MESSAGE_REMOVE_SUCCESS'
export const MESSAGE_REMOVE_FAIL = 'MESSAGE_REMOVE_FAIL'

export function messageRemove(message, team) {
  return (dispatch: Function, getState: Function) => {
    const { messages } = getState()

  }
}

export function messageRemoved(message, team) {
  return (dispatch: Function, getState: Function) => {
    const { messages } = getState()

  }
}
