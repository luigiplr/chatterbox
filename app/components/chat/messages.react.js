import React, { Component, PropTypes } from 'react'
import { List, AutoSizer, CellMeasurer, defaultCellMeasurerCellSizeCache as CellSizeCache } from 'react-virtualized'
import { get } from 'lodash'
import { autobind, throttle } from 'core-decorators'
import raf from 'raf'
import { connect } from 'react-redux'
import Message from './message'
import { chatScrollChanged } from 'actions/chat/scroll'
import styles from 'styles/partials/chat/messages.scss'

function easeInOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue
  }
  return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue
}

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

  componentWillUpdate({ team: newTeam, channelorDMID: newChannelorDMID, messages: newMessages }) {
    if(newTeam !== this.props.team || this.props.channelorDMID !== newChannelorDMID) {
      this._hasScrolled = false
      cellSizeCache.clearAllRowHeights()
    }
    if(newMessages !== this.props.messages && this._scrollTop && this.props.scrollTop && this._scrollTop - this.props.scrollTop < 20) {
      this._scrolling = true
    }
  }

  componentDidUpdate() {
    if(!this._hasScrolled && this.props.messages) {
      if(!this.props.scrollTop) {
        this.props.chatScrollChanged(this._list.Grid._scrollingContainer.scrollHeight)
      }
      this._hasScrolled = true
    }

    if(!this._scrollTop) {
      this._scrollTop = this.props.scrollTop
    }

    if(this._scrolling) {
      const { _scrollingContainer } = this._list.Grid
      this._smoothScroll(_scrollingContainer.scrollHeight - this._scrollTop, _scrollingContainer, this._scrollTop)
    }
  }

  componentWillUnmount() {
    cellSizeCache.clearAllRowHeights()
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
      this.props.chatScrollChanged(this._scrollTop)
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
    if(!this._scrolling && this._hasScrolled && scrollTop !== this.props.scrollTop ) {
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
