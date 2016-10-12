import {get } from 'lodash'
export const MESSAGES_LOAD = 'MESSAGES_LOAD'
export const MESSAGES_LOAD_SUCCESS = 'MESSAGES_LOAD_SUCCESS'
export const MESSAGES_LOAD_FAIL = 'MESSAGES_LOAD_FAIL'


export function loadChannelOrDMMessages(team, id, options) {
  return async(dispatch, getState) => {
    dispatch({ type: MESSAGES_LOAD, payload: { team, id } })
    try {
      const messages = await global._teams[team].loadHistory(id, options)
      console.log(messages)
    } catch (err) {
      dispatch({ type: MESSAGES_LOAD_FAIL, payload: { team, id } })
    }
  }
}

export function channelOrDMMessagesHasLoaded({ messages }, team, id) {
  return get(messages, `${team}.${id}.isLoading`) !== undefined
}
