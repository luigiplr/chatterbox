import { MESSAGES_LOAD, MESSAGES_LOAD_SUCCESS, MESSAGES_LOAD_FAIL } from 'actions/messages'
import { update, get } from 'lodash'

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

function addMessagesToTeamChannel(state, { team, id, messages: newMessages }) {
  const newState = {...state }
  update(newState, `${team}.${id}`, ({ messages = [] } = {}) => ({
    isLoading: false,
    hasLoaded: true,
    messages: [...messages, ...newMessages]
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
