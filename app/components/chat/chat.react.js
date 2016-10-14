import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Header from './header.react'
import Sender from './sender.react'
import Messages from './messages.react'
import styles from 'styles/partials/chat/container.scss'

function mapStateToProps({ chat: { team: { focusedTeam, focusedChannelOrDM }, teams: { loaded } } }) {
  const { users, channels } = loaded[focusedTeam] || {}
  return {
    users,
    channels,
    team: focusedTeam,
    channelorDMID: focusedChannelOrDM[focusedTeam]
  }
}

@connect(mapStateToProps)
export default class Chat extends Component {
  static propTypes = {
    users: PropTypes.object,
    channels: PropTypes.object,
    team: PropTypes.string,
    channelorDMID: PropTypes.string
  }

  static childContextTypes = {
    users: PropTypes.object,
    channels: PropTypes.object
  }

  getChildContext() {
    const { users, channels } = this.props
    return { users, channels }
  }

  render() {
    const { channelorDMID, team } = this.props
    if (!channelorDMID || !team) return null

    return (
      <div className={styles.chat}>
        <Header {...this.props} />
        <Messages {...this.props} />
        <Sender {...this.props} />
      </div>
    )
  }
}
