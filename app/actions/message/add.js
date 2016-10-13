export const MESSAGE_ADD = 'MESSAGE_ADD'

export function addMessage(team, channel_or_dm_id, message) {
  return { type: MESSAGE_ADD, payload: { team, channel_or_dm_id, message } }
}
