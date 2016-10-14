import React, { Component, PropTypes } from 'react'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { changeTeamFocusedChannelOrDM } from 'actions/chat/team/active'
import styles from 'styles/partials/sidebar/info.scss'

function mapStateToProps({ chat: { team: { focusedChannelOrDM, focusedTeam } } }, { id }) {
  return { active: focusedChannelOrDM[focusedTeam] === id, focusedTeam }
}

@connect(mapStateToProps, { changeTeamFocusedChannelOrDM })
export default class DirectMessage extends Component {
  static propTypes = {
    id: PropTypes.string,
    active: PropTypes.bool,
    name: PropTypes.string,
    focusedTeam: PropTypes.string,
    changeTeamFocusedChannelOrDM: PropTypes.func.isRequired
  }

  @autobind
  _handleOnClick() {
    const { changeTeamFocusedChannelOrDM, focusedTeam, id } = this.props
    changeTeamFocusedChannelOrDM(focusedTeam, id)
  }

  render() {
    const { image, active, handle, presence } = this.props
    return (
      <div onClick={this._handleOnClick} className={classnames(styles.dm, { [styles.active]: active }, styles[presence])}>
        <div className={styles.status} />
        <div className={styles.image} style={{backgroundImage: `url(${image})`}} />
        <div className={styles.name}>{handle}</div>
      </div>
    )
  }
}
