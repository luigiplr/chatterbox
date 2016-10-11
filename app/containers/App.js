import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { appLoad } from 'actions/app'
import styles from 'styles/partials/app.scss'

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
      <div className={styles.app_container}>
        {this.props.children}
      </div>
    )
  }
}
