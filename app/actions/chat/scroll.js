export const CHAT_SCROLL_CHANGE = 'CHAT_SCROLL_CHANGE'

export function chatScrollChanged(value) {
  return (dispatch, getState) => {
    const { chat: { team: { focusedTeam, focusedChannelOrDM } } } = getState()
    dispatch({
      type: CHAT_SCROLL_CHANGE,
      payload: {
        value,
        team: focusedTeam,
        channelorDMID: focusedChannelOrDM[focusedTeam]
      }
    })
  }
}
