import { get } from 'lodash'
export const MESSAGES_LOAD = 'MESSAGES_LOAD'
export const MESSAGES_LOAD_SUCCESS = 'MESSAGES_LOAD_SUCCESS'
export const MESSAGES_LOAD_FAIL = 'MESSAGES_LOAD_FAIL'


export function loadChannelOrDMMessages(team, id, options) {
  return async(dispatch, getState) => {
    dispatch({ type: MESSAGES_LOAD, payload: { team, id } })
    try {
      const messages = await global._teams[team].loadHistory(id, options)
      dispatch({ type: MESSAGES_LOAD_SUCCESS, payload: { team, id, messages } })
    } catch (err) {
      console.error(err)
      dispatch({ type: MESSAGES_LOAD_FAIL, payload: { team, id, err } })
    }
  }
}

export function channelOrDMMessagesHasLoaded({ chat: { messages } }, team, id) {
  const isLoading = get(messages, `${team}.${id}.isLoading`, true)
  const hasLoaded = get(messages, `${team}.${id}.hasLoaded`, false)
  return !isLoading && hasLoaded
}
