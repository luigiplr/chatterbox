import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Chat, { Sidebar } from 'components/chat'
import styles from 'styles/partials/chat/container.scss'

export default class ChatPage extends Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.chat_container}>
        <Sidebar />
        <Chat />
      </div>
    )
  }
}
