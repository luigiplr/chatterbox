import React, { Component, PropTypes } from 'react'
import { List, AutoSizer, CellMeasurer, defaultCellMeasurerCellSizeCache as CellSizeCache } from 'react-virtualized'
import { get } from 'lodash'
import { autobind } from 'core-decorators'
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
    recomputeRowHeight: PropTypes.func.isRequired,
    shouldFadeIn: PropTypes.bool.isRequired
  }

  state = {
    shouldFadeIn: true
  }

  getChildContext() {
    return {
      recomputeRowHeight: this._recomputeRowHeight,
      shouldFadeIn: this.state.shouldFadeIn
    }
  }

  componentDidMount() {
    this._scrollTop = this._list.Grid._scrollingContainer.scrollTop

    // for debugging css
    global._resetChatMeasurements = () => {
      cellSizeCache.clearAllRowHeights()
      this._list.forceUpdateGrid()
    }
  }

  componentWillUpdate(nextProps) {
    const { channelorDMID, team } = this.props

    if(nextProps.team !== team || channelorDMID !== nextProps.channelorDMID) {
      console.info('[messages]', "channel or team id's have changed, resetting all internals and saving scroll position")
      this.props.changeFocusedMessageIndex(team, channelorDMID, this._stopIndex)
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
      console.info('[messages]', 'large batch of new messages about to arrive (probs history load), clearing row heights')
      return
    }

    if(
      this._shouldScrollBottom
      && nextProps.team === team
      && nextProps.channelorDMID === channelorDMID
      && nextProps.messages !== messages
    ) {
      this._scrollingToBottom = true
    }
  }

  componentDidUpdate(prevProps) {
    if(this._loadedNewMessages) {
      this._loadedNewMessages = false
      console.info('[messages]', 'finnished loading of batched new messages')
      return
    }

    if(this._scrollingToBottom && !this._scrolling) {
      this._scrolling = true
      console.info('[messages]', 'scrolling to the bottom')
      this._scrollDown()
    }
  }

  componentWillUnmount() {
    console.info('[messages]', 'component unmounting, saving scroll position & resetting row heights')
    const { channelorDMID, team, changeFocusedMessageIndex } = this.props
    changeFocusedMessageIndex(team, channelorDMID, this._stopIndex)
    cellSizeCache.clearAllRowHeights()
    global._resetChatMeasurements = null
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

  get _shouldScrollBottom() {
    return (
      !this._scrollingToBottom
      && this.props.messages - this._stopIndex < 10
    )
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
    this.setState({ shouldFadeIn: true })
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
      console.info('[messages]', 'finnished scrolling to bottom')
    }
  }

  @autobind
  _messageRenderer({ index, rowIndex, style, isScrolling, key }) {
    const messageIndex = index === undefined ? rowIndex : index
    const preRenderingMeasure = style === undefined
    const { channelorDMID, team } = this.props
    return <Message style={style} key={messageIndex} index={messageIndex} channelorDMID={channelorDMID} team={team} preRenderingMeasure={preRenderingMeasure} />
  }

  @autobind
  _recomputeRowHeight(index) {
    console.info('[messages]', 'Recomputing row height for index:', index)
    cellSizeCache.clearRowHeight(index)
    const { _list } = this
    if(_list) {
      _list.recomputeRowHeights(index)
      _list.forceUpdateGrid()
      if (this._shouldScrollBottom) {
        this._scrolling = true
        this._scrollDown()
      }
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
    console.info('[messages]', `Rendered rows ${startIndex} through ${stopIndex}`)
    this._startIndex = startIndex
    this._stopIndex = stopIndex

    if(!this._hasRenderedInitial) {
      console.info('[messages]', 'Initial messages render complete')
      this._hasRenderedInitial = true
      this.setState({ shouldFadeIn: false })
      return
    }
  }

  render() {
    const { messages, team, channelorDMID, focusedMessageID } = this.props
    console.info('[messages]', 'render()')
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
