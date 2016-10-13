import React, { Component, PropTypes } from 'react'
import { Grid, AutoSizer, CellMeasurer } from 'react-virtualized'
import { get } from 'lodash'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import Message from './message'
import styles from 'styles/partials/chat/messages.scss'

function mapStateToProps({ messages: allMessages }, { team, channelorDMID }) {
  const { messages = [], isLoading = true } = get(allMessages, `${team}.${channelorDMID}`, {})
  return { messages, isLoading }
}

@connect(mapStateToProps)
export default class Messages extends Component {
  static propTypes = {
    messages: PropTypes.array
  }

  @autobind
  _messageRenderer({ index, rowIndex, style = {}, isScrolling, key }) {
    const messageIndex = index || rowIndex
    const { messages } = this.props
    const message = messages[messageIndex]
    const firstInChain = message.user !== get(messages[messageIndex-1], 'user', message.user)
    return <Message style={style} firstInChain={firstInChain} key={key || rowIndex} {...message} />
  }

  render() {
    const { messages } = this.props
    return (
      <section className={styles.messages}>
        <AutoSizer>
          {({width, height}) => (
            <CellMeasurer
              cellRenderer={this._messageRenderer}
              columnCount={1}
              rowCount={messages.length}
              width={width}
            >
              {({ getRowHeight }) => (
                <Grid
                  columnCount={1}
                  columnWidth={width}
                  height={height}
                  cellRenderer={this._messageRenderer}
                  rowCount={messages.length}
                  rowHeight={getRowHeight}
                  width={width}
                />
              )}
            </CellMeasurer>
          )}
        </AutoSizer>
      </section>
    )
  }
}
