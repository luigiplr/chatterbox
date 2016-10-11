import React, { Component, PropTypes } from 'react'
import Teams from './teams'
import Info from './info'
import styles from 'styles/partials/sidebar/container.scss'

export default class Sidebar extends Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.sidebar_container}>
        <Teams />
        <Info />
      </div>
    )
  }
}
