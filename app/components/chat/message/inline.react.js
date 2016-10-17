import React, { PropTypes, PureComponent } from 'react'
import { shell } from 'electron'
import { autobind } from 'core-decorators'
import classnames from 'classnames'
import styles from 'styles/partials/chat/message/inline.scss'

const buildImageUrl = (hex, ext = 'png') => `http://cdn.jsdelivr.net/emojione/assets/${ext}/${hex.toUpperCase()}.${ext}`

export function Emoji({ name, hex, url }) {
  return <img className={styles.emoji} title={name} src={url || buildImageUrl(hex)} />
}

Emoji.propTypes = {
  name: PropTypes.string,
  hex: PropTypes.string,
  url: PropTypes.string
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

export class Link extends PureComponent {
  static propTypes = {
    url: PropTypes.string.isRequired,
    label: PropTypes.string
  }

  @autobind
  _handleClick(){
    shell.openExternal(this.props.url)
  }

  render() {
    const { url, label } = this.props
    return (
      <span onClick={this._handleClick} className={styles.link}>
        {label || url}
      </span>
    )
  }
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
      <span className={styles.user}>
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
