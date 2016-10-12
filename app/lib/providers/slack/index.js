import { forEach, pickBy, get, pick, last } from 'lodash'
import { WebClient, RtmClient, MemoryDataStore, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client'
import { santitizeUser } from './helpers'
import { teamLoad, teamLoadSuccess, teamLoadFail } from 'actions/team/load'
import { messageAdd } from 'actions/message/add'


export default class SlackHandler {
  constructor({ auth: { token }, id }, dispatch) {
    this._dispatch = dispatch

    dispatch(teamLoad({ id }))

    this._slack = new RtmClient(token, {
      logLevel: 'error',
      dataStore: new MemoryDataStore(),
      autoReconnect: true,
      autoJoinNewChannels: false
    })

    this._slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, () => {
      this._connected = true
      this._slack._webClient = new WebClient(token)
      console.log('Slack authenticated')
    })

    this._slack.on(CLIENT_EVENTS.RTM.ATTEMPTING_RECONNECT, () => {
      this._connected = false
      this._canSend = false
      console.warn('Slack reconnecting')
    })

    this._slack.on(CLIENT_EVENTS.RTM.DISCONNECT, () => {
      this._canSend = false
      this._connected = false
      console.warn('Slack disconnected')
    })

    this._slack.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, () => {
      this._canSend = false
      this._connected = false
      console.error('o shit dawg, slack suffered some fuckin catastrophic error')
    })

    this._slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      this._canSend = true
      const { users, user } = this._loadUsers()

      dispatch(teamLoadSuccess({
        channels: this._loadChannles(users),
        dms: this._loadDirectMessages(users),
        user,
        users,
        team: this._loadTeam()
      }))
    })

    this._slack.on(RTM_EVENTS.MESSAGE, message => {
      console.log(message)
      /*
      message = santitizeMessage(message)
      if (message) {
        dispatch()
      }
      */
    })

    this._slack.start()
  }

  message = {
    send: this._sendMessage
  }

  _canSend = false
  _connected = false

  loadHistory(channel_or_dm_id, { count = 100, latest = null, oldest = null, inclusive = 0 } = {}) {
    return new Promise((resolve, reject) => {
      let method = 'channels'
      if (channel_or_dm_id.startsWith('D')) method = 'im'
      else if (channel_or_dm_id.startsWith('G')) method = 'groups'
      this._slack._webClient[method].history(channel_or_dm_id, { inclusive, count, latest, oldest, unreads: true }, (a, { has_more, messages = [], ok, unread_count_display }) => {
        if (!ok) return reject()
        resolve(messages)
      })
    })
  }

  /* Start of load methods */

  _loadChannles(users) {
    const channels = {}
    forEach({...this._slack.dataStore.channels, ...this._slack.dataStore.groups }, ({ is_archived, is_open, is_member: isMember, name, is_general: main, id, members, topic, purpose }) => {
      if (is_archived || (!is_open && id.startsWith('G'))) return
      channels[id] = ({
        isMember: id.startsWith('G') || isMember,
        isPrivate: id.startsWith('G'),
        name: id.startsWith('G') ? name : `#${name}`,
        id,
        main,
        members: members && members.map(id => users[id] ? id : false).filter(Boolean) || [],
        meta: {
          topic: get(topic, 'value', null),
          purpose: get(purpose, 'value', null)
        }
      })
    })
    return channels
  }

  _loadDirectMessages(users) {
    const dms = {}
    const readableDMs = pickBy(this._slack.dataStore.dms, ({ user, is_im }) => is_im && users[user])
    forEach(readableDMs, ({ is_open: isOpen, user, id }) => {
      const { name, presence, images, handle } = users[user]
      dms[id] = ({
        isOpen,
        id,
        presence,
        name: `@${handle}`,
        handle,
        image: last(images),
        user,
        meta: { members: presence, topic: name }
      })
    })
    return dms
  }

  _loadUsers() {
    const { activeUserId, dataStore } = this._slack
    const users = {}
    forEach(dataStore.users, user => {
      if (!get(user, 'deleted', false)) {
        users[user.id] = santitizeUser(user)
      }
    })
    return { users, user: users[activeUserId] }
  }

  _loadTeam() {
    const { name, icon, id } = this._slack.dataStore.teams[Object.keys(this._slack.dataStore.teams)[0]]
    return { name, id, image: icon.image_original }
  }

  /* End of load methods */

  /* Start of message methods */

  _sendMessage() {

  }

  _editMessage() {

  }

  /* End of mmessage Methods */


  get id() {
    return
  }
}
