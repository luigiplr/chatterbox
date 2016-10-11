import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import styles from 'styles/partials/chat/header.scss'

export default class Header extends Component {
  static propTypes = {}

  render() {
    return (
      <section className={styles.header_container}>
      </section>
    )
  }
}
