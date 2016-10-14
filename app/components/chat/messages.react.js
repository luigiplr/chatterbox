import React, { Component, PropTypes } from 'react'
import { List, AutoSizer, CellMeasurer, defaultCellMeasurerCellSizeCache as CellSizeCache } from 'react-virtualized'
import { get } from 'lodash'
import { autobind, throttle } from 'core-decorators'
import { connect } from 'react-redux'
import Message from './message'
import { chatScrollChanged } from 'actions/chat/scroll'
import styles from 'styles/partials/chat/messages.scss'

function mapStateToProps({ chat: { messages: allMessages, scroll } }, { team, channelorDMID }) {
  const { messages = [], isLoading = true } = get(allMessages, `${team}.${channelorDMID}`, {})
  const scrollTop = get(scroll, `${team}.${channelorDMID}`, 0)
  return { messages: messages.length, isLoading, scrollTop }
}

const cellSizeCache = new CellSizeCache({
  uniformRowHeight: false,
  uniformColumnWidth: true
})

@connect(mapStateToProps, { chatScrollChanged })
export default class Messages extends Component {
  static propTypes = {
    scrollTop: PropTypes.number,
    team: PropTypes.string.isRequired,
    channelorDMID: PropTypes.string.isRequired,
    messages: PropTypes.number,
    chatScrollChanged: PropTypes.func.isRequired
  }

  componentWillUpdate({ team: newTeam, channelorDMID: newChannelorDMID }) {
    if(newTeam !== this.props.team || this.props.channelorDMID !== newChannelorDMID) {
      this._hasScrolled = false
      cellSizeCache.clearAllRowHeights()
    }
  }

  componentDidUpdate() {
    if(!this._hasScrolled && this.props.messages) {
      if(!this.props.scrollTop) {
        this.props.chatScrollChanged(this._list.Grid._scrollingContainer.scrollHeight)
      }
      this._hasScrolled = true
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

  @autobind
  _onScroll({ scrollTop }) {
    if(this._hasScrolled && scrollTop !== this.props.scrollTop) {
      this.props.chatScrollChanged(scrollTop)
    }
  }

  render() {
    const { messages, scrollTop } = this.props
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
                  ref={ref => this._list = ref}
                  className={styles.scroller}
                  height={height}
                  scrollTop={scrollTop !== 0 ? scrollTop : null}
                  onScroll={this._onScroll}
                  rowRenderer={this._messageRenderer}
                  rowCount={messages}
                  estimatedRowSize={60}
                  overscanRowCount={5}
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
