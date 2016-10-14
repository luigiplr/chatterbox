import { MESSAGES_LOAD, MESSAGES_LOAD_SUCCESS, MESSAGES_LOAD_FAIL } from 'actions/chat/messages'
import { MESSAGE_ADD } from 'actions/chat/message/add'
import { MESSAGE_SEND_SUCCESS } from 'actions/chat/message/send'
import { MESSAGE_EDITED } from 'actions/chat/message/edit'
import { update, get, findIndex } from 'lodash'

const DEFAULT_STATE = {
  errors: {}
}

/*

  messages: {
    [teamID]: {
      [channel_or_id]: {
        messages: {},
        isLoading: Boolean,
        hasLoaded: Boolean,
        hasMore: Boolean
      }
    }
  }

 */

export default function messages(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case MESSAGE_ADD:
      return addMessageToTeamChannel(state, payload)
    case MESSAGE_EDITED:
      return editMessage(state, payload)
    case MESSAGE_SEND_SUCCESS:
      return markMessageAsSent(state, payload)
    case MESSAGES_LOAD:
      return setChannelOrDMLoadingState(state, payload, true)
    case MESSAGES_LOAD_SUCCESS:
      return addMessagesToTeamChannel(state, payload)
    case MESSAGES_LOAD_FAIL:
      return setChannelOrDMLoadingState(state, payload, false)
    default:
      return state
  }
}

function editMessage(state, { team, channelorDMID, message, originalID }) {
  const newState = { ...state }
  update(newState, `${team}.${channelorDMID}`, ({ messages = [], ...data } = {}) => {
    messages[findIndex(messages, ['id', originalID])] = message
    return { messages, ...data }
  })
  return newState
}

function markMessageAsSent(state, { team, id, sendingID, message }){
  const newState = { ...state }
  update(newState, `${team}.${id}`, ({ messages = [], ...data } = {}) => {
    messages[findIndex(messages, ['sendingID', sendingID])] = message
    return { messages, ...data }
  })
  return newState
}

function addMessageToTeamChannel(state, { team, channel_or_dm_id, message }) {
  const newState = { ...state }
  update(newState, `${team}.${channel_or_dm_id}`, ({ messages = [], ...data } = {}) => ({
    messages: [...messages, message],
    ...data
  }))
  return newState
}

function addMessagesToTeamChannel(state, { team, id, messages: newMessages, history }) {
  const newState = {...state }
  update(newState, `${team}.${id}`, ({ messages = [] } = {}) => ({
    isLoading: false,
    hasLoaded: true,
    messages: history ? [...newMessages, ...messages] : [...messages, ...newMessages]
  }))
  return newState
}

function setChannelOrDMLoadingState(state, { team, id }, loadingState) {
  const newState = {...state }
  update(newState, `${team}.${id}`, ({ isLoading, hasLoaded = false, messages = [] } = {}) => ({
    isLoading: loadingState,
    hasLoaded,
    messages
  }))
  return newState
}
