import React, { Component, PropTypes } from 'react'
import { List, AutoSizer, CellMeasurer, defaultCellMeasurerCellSizeCache as CellSizeCache } from 'react-virtualized'
import { get } from 'lodash'
import { autobind, throttle } from 'core-decorators'
import raf from 'raf'
import { connect } from 'react-redux'
import Message from './message'
import { loadMoreChannelOrDMMessages } from 'actions/chat/messages'
import { changeFocusedMessageIndex } from 'actions/chat/message/focused'
import styles from 'styles/partials/chat/messages.scss'

function easeInOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue
  }
  return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue
}

const cellSizeCache = new CellSizeCache({
  uniformRowHeight: false,
  uniformColumnWidth: true
})

function mapStateToProps({ chat: { messages: allMessages } }, { team, channelorDMID }) {
  const { messages = [], focusedMessage, isLoading, hasLoaded } = get(allMessages, `${team}.${channelorDMID}`, {})
  return {
    messages: messages.length,
    isLoading,
    focusedMessageID: focusedMessage || (messages.length - 1),
    hasLoaded
  }
}

@connect(mapStateToProps, { loadMoreChannelOrDMMessages, changeFocusedMessageIndex })
export default class Messages extends Component {
  static propTypes = {
    focusedMessageID: PropTypes.number,
    team: PropTypes.string.isRequired,
    channelorDMID: PropTypes.string.isRequired,
    messages: PropTypes.number,
    isLoading: PropTypes.bool,
    hasLoaded: PropTypes.bool,
    changeFocusedMessageIndex: PropTypes.func.isRequired,
    loadMoreChannelOrDMMessages: PropTypes.func.isRequired
  }

  static defaultProps = {
    messages: 0,
    hasLoaded: false,
    isLoading: true
  }

  static childContextTypes = {
    recomputeRowHeight: PropTypes.func.isRequired
  }

  getChildContext() {
    return { recomputeRowHeight: this._recomputeRowHeight }
  }

  componentDidMount() {
    this._scrollTop = this._list.Grid._scrollingContainer.scrollTop
  }

  componentWillUpdate(nextProps) {
    const { channelorDMID, team } = this.props

    if(nextProps.team !== team || channelorDMID !== nextProps.channelorDMID) {
      this._resetInternals()
      return
    }

    if(!this._scrollTop && get(this, '_list.Grid._scrollingContainer.scrollTop')) {
      this._scrollTop = this._list.Grid._scrollingContainer.scrollTop
    }

    if(!this._hasRenderedInitial) return

    const { isLoading, hasLoaded, focusedMessageID, messages } = this.props

    if (isLoading && !nextProps.isLoading && channelorDMID === nextProps.channelorDMID) {
      cellSizeCache.clearAllRowHeights()
      const oldIndex = (nextProps.messages - messages + this._stopIndex) - 2
      this.props.changeFocusedMessageIndex(team, channelorDMID, oldIndex)
      this._loadedNewMessages = true
      return
    }

    if(
      !this._scrollingToBottom
      && nextProps.team === team
      && nextProps.channelorDMID === channelorDMID
      && nextProps.messages !== messages
      && messages - this._stopIndex < 10
    ) {
      this._scrollingToBottom = true
    }
  }

  componentDidUpdate(prevProps) {
    if(this._loadedNewMessages) {
      this._loadedNewMessages = false
      return
    }

    if(this._scrollingToBottom && !this._scrolling) {
      this._scrolling = true
      this._scrollDown()
    }
  }

  componentWillUnmount() {
    cellSizeCache.clearAllRowHeights()
  }

  @autobind
  _scrollDown() {
    if(!this._scrolling) return
    try {
      const { _scrollingContainer } = this._list.Grid
      const scrollableHeight = _scrollingContainer.scrollHeight - _scrollingContainer.offsetHeight
      const { _scrollTop } = this
      this._smoothScroll(scrollableHeight - _scrollTop, this._list.Grid._scrollingContainer, _scrollTop)
    } catch (err) {
      raf(this._scrollDown)
    }
  }

  _resetInternals() {
    this._startIndex = null
    this._stopIndex = null
    this._loadedNewMessages = false
    this._scrolling = false
    this._scrollTop = null
    this._hasRenderedInitial = false
    this._scrollingToBottom = false
    cellSizeCache.clearAllRowHeights()
  }

  @autobind
  _chatMessageIndexChanged(index){
    const { team, channelorDMID, changeFocusedMessageIndex } = this.props
    changeFocusedMessageIndex(team, channelorDMID, index)
  }

  _handleContainerScroll({ target }) {
    const forward = target.getAttribute('data-scroll') === 'forward'
    const { props: { viewportWidth }, _gridContainer } = this
    const amount = forward ? viewportWidth / 2 : -(viewportWidth / 2)
    this._smoothScroll(amount, _gridContainer)
  }

  _smoothScroll(changeInValue, container, originalPos) {
    const [startValue, totalIterations] = [0, 15] // value at start of operation, seconds * frames
    let iterationCount = 0 // current location from 0 to totalIterations
    this._draw(iterationCount, startValue, changeInValue, totalIterations, container, originalPos)
  }

  _draw(iterationCount, startValue, changeInValue, totalIterations, container, originalPos) {
    // function is adapted from Robert Penner's easing equations, using publicly-available functions from https://www.kirupa.com/js/easing.js
    const currentValue = easeInOutCubic(iterationCount, startValue, changeInValue, totalIterations)
    iterationCount++
    // line below causing error where container is not defined on subsequent draw calls.
    container.scrollTop = currentValue + originalPos
    if ((currentValue / changeInValue) <= 1) {
      raf(() =>
        this._draw(iterationCount, startValue, changeInValue, totalIterations, container, originalPos)
      )
    } else {
      this._scrolling = false
      this._scrollingToBottom = false
    }
  }

  @autobind
  _messageRenderer({ index, rowIndex, style = {}, isScrolling, key }) {
    const messageIndex = index === undefined ? rowIndex : index
    const { channelorDMID, team } = this.props
    return <Message style={style} key={messageIndex} index={messageIndex} channelorDMID={channelorDMID} team={team} />
  }

  @autobind
  _recomputeRowHeight(index) {
    cellSizeCache.clearRowHeight(index)
    const { _list } = this
    if(_list) {
      _list.recomputeRowHeights(index)
      _list.forceUpdateGrid()
    }
  }

  @autobind
  _onScroll({ scrollTop }) {
    this._scrollTop = scrollTop
    if(this._hasRenderedInitial && scrollTop < 10) {
      this.props.loadMoreChannelOrDMMessages()
    }
  }

  @autobind
  _onRowsRendered({ startIndex, stopIndex }) {
    this._startIndex = startIndex
    this._stopIndex = stopIndex

    if(this._loadedNewMessages) return

    if(!this._hasRenderedInitial) {
      this._hasRenderedInitial = true
      return
    }
    this._chatMessageIndexChanged(stopIndex)
  }

  render() {
    const { messages, team, channelorDMID, focusedMessageID } = this.props
    return (
      <section className={styles.messages}>
        <AutoSizer key={`${team}-${channelorDMID}`}>
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
                  ref={ref => (this._list = ref)}
                  className={styles.scroller}
                  onRowsRendered={this._onRowsRendered}
                  height={height}
                  scrollToIndex={focusedMessageID}
                  onScroll={this._onScroll}
                  rowRenderer={this._messageRenderer}
                  rowCount={messages}
                  estimatedRowSize={60}
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
