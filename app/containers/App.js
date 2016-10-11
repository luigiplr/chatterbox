import React, { PureComponent, PropTypes } from 'react'

export default class App extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
