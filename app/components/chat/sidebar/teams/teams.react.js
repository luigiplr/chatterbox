import React, { PropTypes } from 'react'
import Team from './team.react'
import styles from 'styles/partials/sidebar/teams.scss'

export default function Teams({ teams }) {
  return (
    <div className={styles.teams_container}>
      {teams.map(id => <Team key={id} id={id} />)}
    </div>
  )
}

Teams.propTypes = {
  teams: PropTypes.array.isRequired
}
