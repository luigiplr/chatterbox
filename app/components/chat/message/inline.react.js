import React, { PropTypes, PureComponent } from 'react'
import classnames from 'classnames'
import styles from 'styles/partials/chat/message/inline.scss'

export function Code({ code, block = false }) {
  return (
    <code className={block ? styles.codeblock : styles.code}>
      {code}
    </code>
  )
}

Code.propTypes = {
  code: PropTypes.string,
  block: PropTypes.bool
}

export class User extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired
  }

  static contextTypes = {
    users: PropTypes.object.isRequired
  }

  render() {
    const user = this.context.users[this.props.id]
    return (
      <span className={classnames(styles.user)}>
        @{user.handle}
      </span>
    )
  }
}

export class Channel extends PureComponent {
  static propTypes = {
    id: PropTypes.string
  }

  static contextTypes = {
    channels: PropTypes.object.isRequired
  }

  render() {
    const channel = this.context.channels[this.props.id]
    return (
      <span className={styles.channel}>
        {channel.name}
      </span>
    )
  }
}
