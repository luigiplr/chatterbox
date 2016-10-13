import React, { Component, PropTypes } from 'react'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import classnames from 'classnames'
import styles from 'styles/partials/chat/message/message.scss'

function mapStateToProps({ messages }, { team, channelorDMID, index }) {
  messages = get(messages, `${team}.${channelorDMID}.messages`)
  const message = messages[index]
  const firstInChain = index === 0 ? true : message.user !== get(messages[index-1], 'user', message.user)
  return { firstInChain, ...message }
}

@connect(mapStateToProps)
export default class Message extends Component {
  static propTypes = {
    firstInChain: PropTypes.bool,
    style: PropTypes.object,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    friendlyTimestamp: PropTypes.string,
    attachments: PropTypes.array,
    sendingID: PropTypes.string
  }

  static contextTypes = {
    users: PropTypes.object.isRequired
  }

  render() {
    const { style, firstInChain, friendlyTimestamp, text, attachments, user: userID, sendingID } = this.props
    const user = this.context.users[userID]
    const className = classnames(styles.message_container, {[styles.firstInChain]: firstInChain}, {[styles.sending]: sendingID})
    return (
      <div className={className} style={style}>
        <Aside user={user} firstInChain={firstInChain} friendlyTimestamp={friendlyTimestamp} />
        <div className={styles.body}>
          {firstInChain && <Info user={user} friendlyTimestamp={friendlyTimestamp} />}
          {text && <div className={styles.text}>{text}</div>}
        </div>
      </div>
    )
  }
}

function Info({ user, friendlyTimestamp }){
  return (
    <div className={styles.info}>
      <span className={styles.user}>{user.handle}</span>
      <span className={styles.time}>{friendlyTimestamp}</span>
    </div>
  )
}

function Aside({ firstInChain, user, friendlyTimestamp }){
  return (
    <div className={styles.aside}>
      {firstInChain ? <div style={{backgroundImage: `url(${user.images[0]})`}} className={styles.profile_pic} /> : (
        <span className={styles.time}>
          {friendlyTimestamp}
        </span>
      )}
    </div>
  )
}
