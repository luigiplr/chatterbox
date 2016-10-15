import { update, get, set, findIndex } from 'lodash'
import { DEFAULT_CHANNEL_OR_DM_STATE } from './messages'

/* Messages Start */

export function editMessage(state, { team, channelorDMID, message, originalID }) {
  const newState = { ...state }
  update(newState, `${team}.${channelorDMID}`, ({ messages = [], ...data } = {}) => {
    messages[findIndex(messages, ['id', originalID])] = message
    return { ...data, messages }
  })
  return newState
}

export function markMessageAsSent(state, { team, id, sendingID, message }){
  const newState = { ...state }
  update(newState, `${team}.${id}`, ({ messages = [], ...data } = {}) => {
    messages[findIndex(messages, ['sendingID', sendingID])] = message
    return { ...data, messages }
  })
  return newState
}

export function addMessageToTeamChannel(state, { team, channel_or_dm_id, message }) {
  const newState = { ...state }
  update(newState, `${team}.${channel_or_dm_id}`, ({ messages, ...data } = DEFAULT_CHANNEL_OR_DM_STATE) => ({
    ...data,
    messages: [...messages, message]
  }))
  return newState
}

export function markMessageAsFocused(state, { index, team, channelorDMID }) {
  const newState = { ...state }
  set(newState, `${team}.${channelorDMID}.focusedMessage`, index)
  return newState
}

export function addMessagesToTeamChannel(state, { team, id, messages: newMessages, hasMore, history }) {
  const newState = {...state }
  update(newState, `${team}.${id}`, ({ messages, ...data } = DEFAULT_CHANNEL_OR_DM_STATE) => ({
    ...data,
    hasMore,
    isLoading: false,
    hasLoaded: true,
    messages: history ? [...newMessages, ...messages] : [...messages, ...newMessages]
  }))
  return newState
}

export function setChannelOrDMLoadingState(state, { team, id, err, hasMore }, isLoading) {
  const newState = {...state }
  update(newState, `${team}.${id}`, ({ hasLoaded, ...data } = DEFAULT_CHANNEL_OR_DM_STATE) => ({
    ...data, isLoading, hasLoaded: err ? true : hasLoaded, hasMore
  }))
  return newState
}


/* Messages End */
