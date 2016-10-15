import React, { Component, PropTypes } from 'react'
import { List, AutoSizer, CellMeasurer, defaultCellMeasurerCellSizeCache as CellSizeCache } from 'react-virtualized'
import { get } from 'lodash'
import { autobind, throttle } from 'core-decorators'
import raf from 'raf'
import { connect } from 'react-redux'
import Message from './message'
import { loadMoreChannelOrDMMessages } from 'actions/chat/messages'
import { chatScrollChanged } from 'actions/chat/scroll'
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

function mapStateToProps({ chat: { messages: allMessages, scroll } }, { team, channelorDMID }) {
  const { messages = [], isLoading = true } = get(allMessages, `${team}.${channelorDMID}`, {})
  const scrollTop = get(scroll, `${team}.${channelorDMID}`, 0)
  return { messages: messages.length, isLoading, scrollTop }
}

@connect(mapStateToProps, { loadMoreChannelOrDMMessages, chatScrollChanged })
export default class Messages extends Component {
  static propTypes = {
    scrollTop: PropTypes.number,
    team: PropTypes.string.isRequired,
    channelorDMID: PropTypes.string.isRequired,
    messages: PropTypes.number,
    chatScrollChanged: PropTypes.func.isRequired,
    loadMoreChannelOrDMMessages: PropTypes.func.isRequired
  }

  static childContextTypes = {
    recomputeRowHeight: PropTypes.func.isRequired
  }

  getChildContext() {
    return { recomputeRowHeight: this._recomputeRowHeight }
  }

  componentDidMount() {
    window.addEventListener('resize', this._clearAllRowHeights, { passive: true })
  }

  componentWillUpdate({ team: newTeam, channelorDMID: newChannelorDMID, messages: newMessages }) {
    const { channelorDMID, team, messages, scrollTop } = this.props
    if(newTeam !== team || channelorDMID !== newChannelorDMID) {
      this._resetInternals()
    } else if(
      Math.abs(messages - newMessages) > 10
      && newTeam === team
      && newChannelorDMID === channelorDMID
      && this._hasScrolled
    ) {
      const { scrollableHeight, _list } = this
      this._loadedNewMessages = scrollableHeight
      cellSizeCache.clearAllRowHeights()
      _list.measureAllRows()
    }

    const { _scrollTop, scrollableHeight, _loadedNewMessages } = this
    if(
      newMessages !== messages
      && _scrollTop && scrollTop
      && scrollableHeight - _scrollTop < 20
      && !_loadedNewMessages
    ) {
      this._scrolling = true
    }
  }

  componentDidUpdate(prevProps) {
    if(!this._hasScrolled && this.props.messages) {
      this._hasScrolled = true
      if(!this.props.scrollTop) {
        this._originalScrollPos = this._list.Grid._scrollingContainer.scrollHeight
        this._chatScrollChanged(this._originalScrollPos)
      }
    }

    if(!this._scrollTop) {
      this._scrollTop = this.props.scrollTop
    }

    if(this._loadedNewMessages) {
      const oldPos = this.scrollableHeight - this._loadedNewMessages
      this._list.Grid._scrollingContainer.scrollTop = oldPos
      this._chatScrollChanged(oldPos)
      this._loadedNewMessages = false
    }

    if(this._scrolling) {
      this._smoothScroll(this.scrollableHeight - this._scrollTop, this._list.Grid._scrollingContainer, this._scrollTop)
    }
  }

  componentWillUnmount() {
    cellSizeCache.clearAllRowHeights()
    window.removeEventListener('resize', this._clearAllRowHeights)
  }

  _resetInternals() {
    this._originalScrollPos = null
    this._loadedNewMessages = false
    this._scrolling = false
    this._hasScrolled = false
    cellSizeCache.clearAllRowHeights()
  }

  @autobind
  @throttle(20)
  _clearAllRowHeights() {
    cellSizeCache.clearAllRowHeights()
    this._list.measureAllRows()
    this._list.forceUpdateGrid()
    console.log('re-measured everything')
  }

  @autobind
  @throttle(10)
  _chatScrollChanged(val){
    this.props.chatScrollChanged(val)
  }

  get scrollableHeight() {
    const { _scrollingContainer } = this._list.Grid
    return _scrollingContainer.scrollHeight - _scrollingContainer.offsetHeight
  }

  _handleContainerScroll({ target }) {
    const forward = target.getAttribute('data-scroll') === 'forward'
    const { props: { viewportWidth }, _gridContainer } = this
    const amount = forward ? viewportWidth / 2 : -(viewportWidth / 2)
    this._smoothScroll(amount, _gridContainer)
  }

  _smoothScroll(changeInValue: number, container: Object, originalPos: number) {
    const [startValue, totalIterations] = [0, 15] // value at start of operation, seconds * frames
    let iterationCount = 0 // current location from 0 to totalIterations
    this._draw(iterationCount, startValue, changeInValue, totalIterations, container, originalPos)
  }

  _draw(iterationCount: number, startValue: number, changeInValue: number, totalIterations: number, container: Object, originalPos: number) {
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
      this._chatScrollChanged(this._scrollTop)
    }
  }

  @autobind
  _messageRenderer({ index, rowIndex, style = {}, isScrolling, key }) {
    const messageIndex = index === undefined ? rowIndex : index
    const { channelorDMID, team } = this.props
    return <Message style={style} key={messageIndex} index={messageIndex} channelorDMID={channelorDMID} team={team} />
  }

  @autobind
  _onScroll({ scrollTop }) {
    this._scrollTop = scrollTop
    const { _hasScrolled } = this

    if(!this._scrolling && _hasScrolled && scrollTop !== this.props.scrollTop && scrollTop !== 0) {
      this._chatScrollChanged(scrollTop)
    }

    if(_hasScrolled && scrollTop < 20) {
      this.props.loadMoreChannelOrDMMessages()
    }
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
                  scrollTop={scrollTop !== 0 ? scrollTop : (this._originalScrollPos || null)}
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
