import { get } from 'lodash'
export const MESSAGES_LOAD = 'MESSAGES_LOAD'
export const MESSAGES_LOAD_SUCCESS = 'MESSAGES_LOAD_SUCCESS'
export const MESSAGES_LOAD_FAIL = 'MESSAGES_LOAD_FAIL'

export function loadMoreChannelOrDMMessages() {
  return (dispatch, getState) => {
    const { chat: { team: { focusedTeam, focusedChannelOrDM }, messages } } = getState()
    const channelorDMID = focusedChannelOrDM[focusedTeam]
    const { isLoading, messages: [firstMessage] } = get(messages, `${focusedTeam}.${channelorDMID}`, {})
    if(isLoading) return
    dispatch(loadChannelOrDMMessages(focusedTeam, channelorDMID, { latest: firstMessage.timestamp }, true))
  }
}

export function loadChannelOrDMMessages(team, id, options, history = false) {
  return async(dispatch, getState) => {
    dispatch({ type: MESSAGES_LOAD, payload: { team, id } })
    try {
      const messages = await global._teams[team].loadHistory(id, options)
      dispatch({ type: MESSAGES_LOAD_SUCCESS, payload: { team, id, messages, history } })
    } catch (err) {
      console.error(err)
      dispatch({ type: MESSAGES_LOAD_FAIL, payload: { team, id, messages: [], err, history } })
    }
  }
}

export function channelOrDMMessagesHasLoaded({ chat: { messages } }, team, id) {
  const isLoading = get(messages, `${team}.${id}.isLoading`, true)
  const hasLoaded = get(messages, `${team}.${id}.hasLoaded`, false)
  return !isLoading && hasLoaded
}
