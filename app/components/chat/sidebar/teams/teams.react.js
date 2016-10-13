import React, { PropTypes } from 'react'
import classnames from 'classnames'
import Team from './team.react'
import styles from 'styles/partials/sidebar/teams.scss'

export default function Teams({ teams, selectedImage }) {
  return (
    <div className={styles.teams_container}>
      {selectedImage && <div className={classnames(styles.team, styles.selected)} style={{backgroundImage: `url(${selectedImage})`}} />}
      {teams.map(id => <Team key={id} id={id} />)}
    </div>
  )
}

Teams.propTypes = {
  teams: PropTypes.array.isRequired,
  selectedImage: PropTypes.string
}
