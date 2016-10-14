import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import Teams from './teams'
import Info from './info'
import styles from 'styles/partials/sidebar/container.scss'

function mapStateToProps({ chat: { teams: { loaded }, team: { focusedTeam } } }) {
  return { teams: loaded, team: focusedTeam }
}

@connect(mapStateToProps)
export default class Sidebar extends Component {
  static propTypes = {
    teams: PropTypes.object.isRequired,
    team: PropTypes.string
  }

  render() {
    const { team, teams } = this.props
    return (
      <div className={styles.sidebar_container}>
        <Teams teams={Object.keys(teams)} selectedImage={get(teams, `${team}.team.image`)} />
        {team && <Info id={team} />}
      </div>
    )
  }
}
