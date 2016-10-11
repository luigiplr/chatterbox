export const MESSAGE_ADD = 'MESSAGE_ADD'

export function messageAdd(message, team) {
  return { type: MESSAGE_ADD, payload: { team, message } }
}
