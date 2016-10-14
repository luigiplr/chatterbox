import { APP_SCREEN_RESOLUTION_SET } from 'actions/app/screen'

const DEFAULT_STATE = {
  width: 0,
  height: 0
}

export default function screen(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case APP_SCREEN_RESOLUTION_SET:
      return { ...state, ...payload }
    default:
      return state
  }
}
