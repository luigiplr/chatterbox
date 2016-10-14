import React, { Component, PropTypes } from 'react'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import classnames from 'classnames'
import Attachments from './attachments.react'
import styles from 'styles/partials/chat/message/message.scss'

function mapStateToProps({ chat: { messages } }, { team, channelorDMID, index }) {
  messages = get(messages, `${team}.${channelorDMID}.messages`, [])
  const message = messages[index]
  let firstInChain = index === 0
  if (!firstInChain) {
    const nextMessage = messages[index-1]
    const currentUser = get(message, 'userProfile.id') || message.user
    const lastUser = get(nextMessage, 'user') || get(nextMessage, 'userProfile.id') || currentUser
    firstInChain = lastUser !== currentUser
  }
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

  get user() {
    const { props: { user, userProfile }, context: { users } } = this
    return userProfile || users[user] || {}
  }

  render() {
    const { style, firstInChain, friendlyTimestamp, text, attachments, sendingID } = this.props
    const { user } = this
    const className = classnames(styles.message_container, {[styles.firstInChain]: firstInChain}, {[styles.sending]: sendingID})
    return (
      <div className={className} style={style}>
        <Aside {...user} firstInChain={firstInChain} friendlyTimestamp={friendlyTimestamp} />
        <div className={styles.body}>
          {firstInChain && <Info {...user} friendlyTimestamp={friendlyTimestamp} />}
          {text && <div className={styles.text}>{text}</div>}
          {attachments && <Attachments attachments={attachments} />}
        </div>
      </div>
    )
  }
}

function Info({ handle, friendlyTimestamp }){
  return (
    <div className={styles.info}>
      <span className={styles.user}>{handle}</span>
      <span className={styles.time}>{friendlyTimestamp}</span>
    </div>
  )
}

Info.propTypes = {
  handle: PropTypes.string,
  friendlyTimestamp: PropTypes.string.isRequired
}

function Aside({ firstInChain, image, images = [], friendlyTimestamp }){
  return (
    <div className={styles.aside}>
      {firstInChain ? <div style={{backgroundImage: `url(${image || images[0]})`}} className={styles.profile_pic} /> : (
        <span className={styles.time}>
          {friendlyTimestamp}
        </span>
      )}
    </div>
  )
}

Aside.propTypes = {
  firstInChain: PropTypes.bool.isRequired,
  image: PropTypes.string,
  images: PropTypes.array,
  friendlyTimestamp: PropTypes.string.isRequired
}
