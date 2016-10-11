import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Header from './header.react'
import Messages from './messages.react'
import styles from 'styles/partials/chat/container.scss'

export default class Chat extends Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.chat}>
        <Header />
        <Messages />
      </div>
    )
  }
}
