import { filter, get, last, omitBy, isNil } from 'lodash'
import moment from 'moment'
import crypto from 'crypto'
import formatter from './formatter'

export function santitizeUser({ tz: timezone, id, deleted, profile, name: handle, presence }) {
  return {
    handle,
    name: get(profile, 'real_name_normalized', null),
    id,
    presence: presence === 'active' ? 'online' : 'offline',
    images: filter(profile, (data, key) => key.includes('image')),
    meta: { timezone, email: get(profile, 'email') }
  }
}

function santitizeMessage({ user, text, ts: timestamp, user_profile: userProfile = null, attachments = [], edited = '' }) {
  return {
    id: timestamp,
    message: omitBy({
      //    attachments: santitizeAttachments.bind(this)(attachments),
      user,
      text: text && formatter.bind(this)(text),
      userProfile,
      timestamp,
      friendlyTimestamp: moment.unix(timestamp).format('h:mm a')
    }, isNil)
  }
}

export function parseMessage(dispatch, { type, subtype, bot_id, ...messageData }, peerEvent = false) {
  let isBot = Boolean(bot_id)
  let userProfileChecked = false
  switch (subtype ? `${type}:${subtype}` : type) {
    case 'message:bot_message':
      {
        isBot = true
        userProfileChecked = true
        const { images, icons, name: handle, id } = this._slack.dataStore.bots[bot_id]
        messageData.user_profile = { handle, id, image: last(filter((images || icons), (a, key) => key.includes('image'))) }
      }
    case 'message:file_share': // eslint-disable-line no-fallthrough
    case 'message':
      {
        if (messageData.user_profile && !userProfileChecked) {
          const { name: handle, real_name: name, ...user_profile } = messageData.user_profile
          messageData.user_profile = {
            image: last(filter(user_profile, (a, key) => key.includes('image') || key.includes('icon'))),
            handle,
            name
          }
        }

        const msg = omitBy({ isBot, ...santitizeMessage.bind(this)(messageData) }, isNil)
        return msg
      }
    case 'message:message_changed':
      {
        const { message, event_ts: eventTimestamp, previous_message: { ts: previousMessageTimestamp } } = messageData
        const msg = {
          channel,
          message: santitizeMessage.bind(this)({...message, edited: eventTimestamp }),
          edit: { eventTimestamp },
          previousMessageTimestamp
        }
        return msg
      }
    default:
      // console.info('Unable to parse message:', { type, subtype, ...messageData })
      return false
  }
}
