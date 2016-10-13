import React, { Component, PropTypes } from 'react'
import { Grid, AutoSizer, CellMeasurer, defaultCellMeasurerCellSizeCache as CellSizeCache } from 'react-virtualized'
import { get } from 'lodash'
import { autobind, throttle } from 'core-decorators'
import { connect } from 'react-redux'
import Message from './message'
import styles from 'styles/partials/chat/messages.scss'

function mapStateToProps({ messages: allMessages }, { team, channelorDMID }) {
  const { messages = [], isLoading = true } = get(allMessages, `${team}.${channelorDMID}`, {})
  return { messages, isLoading }
}

const cellSizeCache = new CellSizeCache({
  uniformRowHeight: false,
  uniformColumnWidth: true
})

@connect(mapStateToProps)
export default class Messages extends Component {
  static propTypes = {
    team: PropTypes.string.isRequired,
    channelorDMID: PropTypes.string.isRequired,
    messages: PropTypes.array
  }

  componentWillUpdate({ team: newTeam, channelorDMID: newChannelorDMID }) {
    if(newTeam !== this.props.team || this.props.channelorDMID !== newChannelorDMID) {
      cellSizeCache.clearAllRowHeights()
    }
  }

  componentWillUnmount() {
    cellSizeCache.clearAllRowHeights()
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
              cellSizeCache={cellSizeCache}
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
