import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import classnames from 'classnames'
import styles from 'styles/partials/chat/message/message.scss'

export default class Message extends Component {
  static propTypes = {
    firstInChain: PropTypes.bool,
    style: PropTypes.object,
    text: PropTypes.string,
    friendlyTimestamp: PropTypes.string,
    attachments: PropTypes.array
  }

  static contextTypes = {
    users: PropTypes.object.isRequired
  }

  get user() {
    return this.context.users[this.props.user]
  }

  render() {
    const { style, firstInChain, friendlyTimestamp, text, attachments } = this.props
    const { user } = this
  //  console.log(this)
    return (
      <div className={classnames(styles.message_container, {[styles.firstInChain]: firstInChain})} style={style}>
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
