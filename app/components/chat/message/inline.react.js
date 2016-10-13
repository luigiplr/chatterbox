import React, { PropTypes, PureComponent } from 'react'
import classnames from 'classnames'
import styles from 'styles/partials/chat/message/inline.scss'

const buildImageUrl = (hex, ext = 'png') => `http://cdn.jsdelivr.net/emojione/assets/${ext}/${hex.toUpperCase()}.${ext}`

export function Emoji({ name, hex }) {
  return <img className={styles.emoji} title={name} src={buildImageUrl(hex)} />
}

Emoji.propTypes = {
  name: PropTypes.string,
  hex: PropTypes.string.isRequired
}

export function Code({ code, block = false }) {
  return (
    <code className={block ? styles.codeblock : styles.code}>
      {code}
    </code>
  )
}

Code.propTypes = {
  code: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
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
