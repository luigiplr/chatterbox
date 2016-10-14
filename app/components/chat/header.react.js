import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import styles from 'styles/partials/chat/header.scss'

function mapStateToProps({ chat: { teams: { loaded } } }, { team, channelorDMID }) {
  const { channels, dms } = loaded[team]
  let [data, isDM] = [null, false]

  if (channels[channelorDMID]) {
    data = channels[channelorDMID]
  } else {
    data = dms[channelorDMID]
    isDM = true
  }

  const { name, members, meta } = data
  return { name, members, meta }
}

@connect(mapStateToProps)
export default class Header extends Component {
  static propTypes = {
    name: PropTypes.string,
    members: PropTypes.array,
    meta: PropTypes.object
  }

  @autobind
  _renderChannelMeta() {
    const { members, meta } = this.props
    let channelMeta = []
    if (members) {
      channelMeta.push(
        <span className={styles.meta} key='members'>
          {members.length} Members
        </span>
      )
    }

    if (meta.topic) {
      channelMeta.push(
        <div key='topic'>
          <span className={styles.spacer}>|</span>
          <span className={styles.meta}>{meta.topic}</span>
        </div>
      )
    }

    return channelMeta
  }

  render() {
    return (
      <section className={styles.header_container}>
        <h1 className={styles.name}>{this.props.name}</h1>
        {this._renderChannelMeta()}
      </section>
    )
  }
}
