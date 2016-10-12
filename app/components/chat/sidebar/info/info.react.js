import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { values } from 'lodash'
import { connect } from 'react-redux'
import Channel from './channel.react'
import styles from 'styles/partials/sidebar/info.scss'

function mapStateToProps({ teams: { loaded } }, { id }) {
  const { channels, dms, team, user } = loaded[id] || {}
  return { channels: values(channels), dms: values(dms), team, user }
}

@connect(mapStateToProps)
export default class Info extends Component {
  static propTypes = {
    channels: PropTypes.array,
    dms: PropTypes.array,
    team: PropTypes.object,
    user: PropTypes.object
  }

  render() {
    const { channels, team, user } = this.props
    return (
      <div className={styles.info_container}>
        <div className={styles.team}>
          <div className={styles.name}>{team.name}</div>
          <div className={classnames(styles.status, [styles[user.presence]]: styles.presence)} />
          <span className={styles.handle}>{user.handle}</span>
        </div>
        <div className={styles.channels_container}>
          <h1 className={styles.title}>Channels</h1>
          {channels.map(channel => <Channel key={channel.id} {...channel} />)}
        </div>
      </div>
    )
  }
}

function TeamUser() {

}
