import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import styles from 'styles/partials/sidebar/teams.scss'
import { changeFocusedTeam } from 'actions/chat/team/active'

function mapStateToProps({ chat: { teams: { loaded } } }, { id }) {
  const { team: { image, name } } = loaded[id]
  return { image, name }
}

@connect(mapStateToProps, { changeFocusedTeam })
export default class Team extends PureComponent {
  static propTypes = {
    changeFocusedTeam: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    image: PropTypes.string
  }

  @autobind
  _handleTeamClick() {
    const { id, changeFocusedTeam } = this.props
    changeFocusedTeam(id)
  }

  render() {
    const { image } = this.props
    return (
      <div className={styles.team} onClick={this._handleTeamClick} style={{backgroundImage: `url(${image})`}}>
      </div>
    )
  }
}
