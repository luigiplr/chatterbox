import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Teams from './teams'
import Info from './info'
import styles from 'styles/partials/sidebar/container.scss'

function mapStateToProps({ teams: { loaded }, team: { focusedID } }, { id }) {
  return { teams: Object.keys(loaded), team: focusedID }
}

@connect(mapStateToProps)
export default class Sidebar extends Component {
  static propTypes = {
    teams: PropTypes.array.isRequired,
    team: PropTypes.string
  }

  render() {
    const { team, teams } = this.props
    return (
      <div className={styles.sidebar_container}>
        <Teams teams={teams} />
        <Info id={team} />
      </div>
    )
  }
}
