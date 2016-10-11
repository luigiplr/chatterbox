import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { appLoad } from 'actions/app'

@connect(null, { appLoad })
export default class App extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
    appLoad: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.appLoad()
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
