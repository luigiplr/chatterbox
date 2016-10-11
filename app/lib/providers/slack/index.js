import { forEach, pickBy, get, pick } from 'lodash'
import { WebClient, RtmClient, MemoryDataStore, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client'
// import { santitizeUser, parseMessage } from './helpers'


export default class SlackHandler {
  constructor({ auth: { token } }, dispatch) {
    this._dispatch = dispatch

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
      console.log('Slack connection opened')
    })

    //  this._slack.on(RTM_EVENTS.MESSAGE, parseMessage.bind(this))

    this._slack.start()
  }

  message = {
    send: this._sendMessage
  }

  _canSend = false
  _connected = false

  _getHistory({ id }) {

  }

  /* Start of load methods */

  _loadChannles() {

  }

  _loadDirectMessages() {

  }

  _loadUsers() {

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
