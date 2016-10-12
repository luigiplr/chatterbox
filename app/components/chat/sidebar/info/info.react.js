import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import styles from 'styles/partials/sidebar/info.scss'

function mapStateToProps({ teams: { loaded } }, { id }) {
  const { channels, dms, team } = loaded[id] || {}
  return { channels, dms, team }
}

@connect(mapStateToProps)
export default class Info extends Component {
  static propTypes = {
    channels: PropTypes.object,
    dms: PropTypes.object,
    team: PropTypes.object
  }

  render() {
    return (
      <div className={styles.info_container}>
      </div>
    )
  }
}
