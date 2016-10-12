import React, { Component, PropTypes } from 'react'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { changeTeamFocusedChannelOrDM } from 'actions/team/active'
import styles from 'styles/partials/sidebar/info.scss'

function mapStateToProps({ team: { focusedChannelOrDM, focusedTeam } }, { id }) {
  return { active: focusedChannelOrDM[focusedTeam] === id, focusedTeam }
}

@connect(mapStateToProps, { changeTeamFocusedChannelOrDM })
export default class Channel extends Component {
  static propTypes = {
    id: PropTypes.string,
    active: PropTypes.bool,
    name: PropTypes.string,
    isPrivate: PropTypes.bool.isRequired,
    focusedTeam: PropTypes.string,
    changeTeamFocusedChannelOrDM: PropTypes.func.isRequired
  }

  @autobind
  _handleOnClick() {
    const { changeTeamFocusedChannelOrDM, focusedTeam, id } = this.props
    changeTeamFocusedChannelOrDM(focusedTeam, id)
  }

  render() {
    const { active, name, isPrivate } = this.props
    return (
      <div onClick={this._handleOnClick} className={classnames(styles.channel, {[styles.active]: active})}>
        {isPrivate ? <i className='ion-locked privateIcon' /> : null}
        <p>{name}</p>
      </div>
    )
  }
}
