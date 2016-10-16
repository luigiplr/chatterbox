import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { appLoad } from 'actions/app/load'
import styles from 'styles/partials/app.scss'
import themes from 'styles/themes.scss'

@connect(null, { appLoad })
export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    appLoad: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.appLoad()
  }

  render() {
    return (
      <div className={classnames(styles.app_container, themes.light)}>
        {this.props.children}
      </div>
    )
  }
}
