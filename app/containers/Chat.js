import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Sidebar from 'components/chat/sidebar'
import styles from 'styles/partials/chat/container.scss'

export default class Chat extends Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.chat_container}>
        <Sidebar />
      </div>
    )
  }
}
