import { set } from 'lodash'
import { CHAT_SCROLL_CHANGE } from 'actions/chat/scroll'

export default function scroll(state = {}, { type, payload }) {
  switch (type) {
    case CHAT_SCROLL_CHANGE:
      return setTeamChannelorDMScroll(state, payload)
    default:
      return state
  }
}

function setTeamChannelorDMScroll(state, { team, channelorDMID, value}){
  const newState = { ...state }
  set(newState, `${team}.${channelorDMID}`, value)
  return newState
}
