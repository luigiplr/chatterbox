import React, { Component, PropTypes } from 'react'
import { List, AutoSizer, CellMeasurer } from 'react-virtualized'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import styles from 'styles/partials/chat/messages.scss'

export default class Messages extends Component {
  static propTypes = {
    messages: PropTypes.array
  }

  @autobind
  _messageRenderer({ index, style, isScrolling, key }) {
    return <div key={key} style={style} />
  }

  render() {
    const messages = []
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
                <List
                  autoHeight
                  overscanRowCount={2}
                  height={height}
                  rowCount={messages.length}
                  rowHeight={getRowHeight}
                  rowRenderer={this._messageRenderer}
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
