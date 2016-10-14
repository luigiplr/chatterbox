import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { sendMessage } from 'actions/chat/message/send'
import styles from 'styles/partials/chat/sender.scss'

@connect(null, { sendMessage })
export default class Sender extends Component {
  static propTypes = {
    team: PropTypes.string.isRequired,
    channelorDMID: PropTypes.string.isRequired,
    sendMessage: PropTypes.func.isRequired
  }

  @autobind
  _handleKeyPress(event) {
    if (event.keyCode == 13 && !event.shiftKey) {
      event.preventDefault()
      const { value: chatText } = this.refs['chat-input']
      if (chatText.replace(/(\r\n|\n|\r)/gm, '').length === 0) return
      const { sendMessage, channelorDMID, team } = this.props
      sendMessage(team, channelorDMID, chatText)
      this.refs['chat-input'].value = ''
    }
  }

  render() {
    return (
      <section className={styles.sender}>
        <textarea
          onKeyDown={this._handleKeyPress}
          ref='chat-input'
          placeholder='Type something...'
        />
      </section>
    )
  }
}
