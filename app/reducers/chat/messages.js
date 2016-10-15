import { MESSAGES_LOAD, MESSAGES_LOAD_SUCCESS, MESSAGES_LOAD_FAIL } from 'actions/chat/messages'
import { MESSAGE_ADD } from 'actions/chat/message/add'
import { MESSAGE_SEND_SUCCESS } from 'actions/chat/message/send'
import { MESSAGE_EDITED } from 'actions/chat/message/edit'
import { MESSAGE_FOCUSED_INDEX_CHANGE } from 'actions/chat/message/focused'
import {
  addMessageToTeamChannel, editMessage, markMessageAsSent, markMessageAsFocused,
  setChannelOrDMLoadingState, addMessagesToTeamChannel
} from './helpers'

const DEFAULT_STATE = {
  errors: {}
}

export const DEFAULT_CHANNEL_OR_DM_STATE = {
  messages: [],
  focusedMessage: null,
  isLoading: true,
  hasLoaded: false,
  hasMore: true
}

/*

  messages: {
    [teamID]: {
      [channel_or_id]: DEFAULT_CHANNEL_OR_DM_STATE
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
    case MESSAGE_FOCUSED_INDEX_CHANGE:
      return markMessageAsFocused(state, payload)

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
