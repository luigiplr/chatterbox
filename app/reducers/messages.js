const DEFAULT_STATE = {
  errors: {}
}

/*

messages: {
  [teamID]: {
    [channel_or_id]: {
      messages: {},
      isLoading: Boolean
    }
  }
}

 */

export default function messages(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    default: return state
  }
}
