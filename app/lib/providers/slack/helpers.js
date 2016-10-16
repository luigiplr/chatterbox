import { filter, get, last, omitBy, isNil } from 'lodash'
import escapeStringRegexp from 'escape-string-regexp'
import path from 'path'
import moment from 'moment'
import crypto from 'crypto'
import formatter from './formatter'
import santitizeAttachments from './attachments'
import { addMessage } from 'actions/chat/message/add'
import { messageEdited } from 'actions/chat/message/edit'

export function getEscapedKeys(hash){
  return Object.keys(hash).map(x => escapeStringRegexp(x)).join('|')
}

function extractWidthFromImage(image) {
  const { name } = path.parse(image)
  return last(name.split('_')) + '0'
}

export function santitizeUser({ tz: timezone, id, deleted, profile, name: handle, presence }) {
  return {
    handle,
    name: get(profile, 'real_name_normalized', null),
    id,
    presence: presence === 'active' ? 'online' : 'offline',
    images: filter(profile, (data, key) => key.includes('image')).map(url => ({
      url,
      width: extractWidthFromImage(url)
    })),
    meta: { timezone, email: get(profile, 'email') }
  }
}

function santitizeMessage({ user, text, ts: timestamp, user_profile: userProfile = null, attachments, edited = '', sendingID }) {
  return {
    id: timestamp + user,
    ...omitBy({
      edited,
      attachments: attachments && santitizeAttachments.bind(this)(attachments),
      sendingID,
      user,
      text: text && formatter.bind(this)(text),
      userProfile,
      timestamp,
      friendlyTimestamp: moment.unix(timestamp).format('h:mm a')
    }, isNil)
  }
}

export function parseMessage(dispatch, { type, subtype, team, channel, bot_id, ...messageData }, organic = false) {
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
        if(organic) dispatch(addMessage(team, channel, msg))
        return msg
      }
    case 'message:message_changed':
      {
        const { message, event_ts: eventTimestamp, previous_message: { ts: previousMessageTimestamp } } = messageData
        const msg = omitBy({ isBot, ...santitizeMessage.bind(this)({ ...message, edited: eventTimestamp }) }, isNil)
        if (organic) dispatch(messageEdited(this._team.id, channel, msg, previousMessageTimestamp + msg.user))
        return msg
      }
    default:
      // console.info('Unable to parse message:', { type, subtype, ...messageData })
      return false
  }
}
