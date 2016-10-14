import React, { Component, PropTypes } from 'react'
import { List, AutoSizer, CellMeasurer, defaultCellMeasurerCellSizeCache as CellSizeCache } from 'react-virtualized'
import { get } from 'lodash'
import { autobind, throttle } from 'core-decorators'
import { connect } from 'react-redux'
import Message from './message'
import styles from 'styles/partials/chat/messages.scss'

function mapStateToProps({ chat: { messages: allMessages } }, { team, channelorDMID }) {
  const { messages = [], isLoading = true } = get(allMessages, `${team}.${channelorDMID}`, {})
  return { messages: messages.length, isLoading }
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
    messages: PropTypes.number
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
    const messageIndex = index === undefined ? rowIndex : index
    const { channelorDMID, team } = this.props
    return <Message style={style} key={messageIndex} index={messageIndex} channelorDMID={channelorDMID} team={team} />
  }


  render() {
    const { messages } = this.props
    const estimatedSize = 60 * messages
    return (
      <section className={styles.messages}>
        <AutoSizer>
          {({width, height}) => (
            <CellMeasurer
              cellRenderer={this._messageRenderer}
              cellSizeCache={cellSizeCache}
              columnCount={1}
              rowCount={messages}
              width={width}
            >
              {({ getRowHeight }) => (
                <List
                  className={styles.scroller}
                  height={height}
                  rowRenderer={this._messageRenderer}
                  rowCount={messages}
                  estimatedRowSize={60}
                  rowHeight={getRowHeight}
                  scrollToAlignment='end'
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
