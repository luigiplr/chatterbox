import React, { Component, PureComponent, PropTypes } from 'react'
import memoizee from 'memoizee'
import { uniq, get, reduce, findIndex } from 'lodash'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import classnames from 'classnames'
import Attachments from './attachments.react'
import styles from 'styles/partials/chat/message/message.scss'

function mapStateToProps({ chat: { messages } }, { team, channelorDMID, index }) {
  messages = get(messages, `${team}.${channelorDMID}.messages`, [])
  const message = messages[index]
  let firstInChain = index === 0
  if (!firstInChain) {
    const nextMessage = messages[index-1]
    const currentUser = get(message, 'userProfile.id') || message.user
    const lastUser = get(nextMessage, 'user') || get(nextMessage, 'userProfile.id') || currentUser
    firstInChain = lastUser !== currentUser
  }
  return { firstInChain, ...message }
}

@connect(mapStateToProps)
export default class Message extends Component {
  static propTypes = {
    firstInChain: PropTypes.bool,
    style: PropTypes.object,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    friendlyTimestamp: PropTypes.string,
    attachments: PropTypes.array,
    sendingID: PropTypes.string,
    edited: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    index: PropTypes.number.isRequired,
    preRenderingMeasure: PropTypes.bool.isRequired
  }

  static contextTypes = {
    users: PropTypes.object.isRequired,
    recomputeRowHeight: PropTypes.func.isRequired,
    shouldFadeIn: PropTypes.bool.isRequired
  }

  static childContextTypes = {
    preRenderingMeasure: PropTypes.bool.isRequired
  }

  getChildContext() {
    const { preRenderingMeasure } = this.props
    return { preRenderingMeasure }
  }

  componentDidMount() {
    console.info('[message]', 'componentDidMount() w/preRenderingMeasure: ', this.props.preRenderingMeasure)
  }

  componentDidUpdate({ edited: prevEdited }) {
    const { edited, preRenderingMeasure } = this.props
    if (prevEdited !== edited && !preRenderingMeasure) {
      this.context.recomputeRowHeight(this.props.index)
      console.info('[message]', 'Triggering self re-measure of index: ', this.props.index)
    }
  }

  get user() {
    const { props: { user, userProfile }, context: { users } } = this
    return userProfile || users[user] || {}
  }

  render() {
    const {
      props: { style, firstInChain, friendlyTimestamp, text, attachments, sendingID, edited },
      context: { shouldFadeIn },
      user
    } = this

    const className = classnames(
      styles.message_container,
      {[styles.firstInChain]: firstInChain},
      {[styles.sending]: sendingID},
      {[styles.fadeIn]: shouldFadeIn}
    )

    return (
      <div className={className} style={style}>
        <Aside {...user} firstInChain={firstInChain} friendlyTimestamp={friendlyTimestamp} />
        <div className={styles.body}>
          {firstInChain && <Info edited={edited} {...user} friendlyTimestamp={friendlyTimestamp} />}
          {text && <div className={styles.text}>{text}</div>}
          {attachments && <Attachments attachments={attachments} />}
        </div>
      </div>
    )
  }
}

function Info({ handle, friendlyTimestamp, edited }){
  return (
    <div className={styles.info}>
      <span className={styles.user}>{handle}</span>
      <span className={styles.time}>{friendlyTimestamp}</span>
      {edited && <span className={styles.time}>(edited)</span>}
    </div>
  )
}

Info.propTypes = {
  handle: PropTypes.string,
  friendlyTimestamp: PropTypes.string.isRequired
}

function getClosest(array, target) {
  const tuples = array.map(val => [val, Math.abs(val - target)])
  return reduce(tuples, (memo, val) => (memo[1] < val[1]) ? memo : val, [-1, 999])[0]
}

const defaultImage = 'https://community.teamdynamix.com/Images/GenericUser.png'
const findImageFromImages = memoizee((images, image, width) => {
  if(image) return image

  if(images.length) {
    let widths = []
    images.forEach(({ width }) => widths.push(+width))
    widths = uniq(widths.filter(width => !isNaN(width)))
    const indexOfWidth = findIndex(images, ['width', getClosest(widths, width).toString()])
    const { url } = images[indexOfWidth] || {}
    return url || defaultImage
  }

  return defaultImage
}, { maxAge: 60000, max: 20 })

@connect(({ app: { screen } } ) => ({ screen }))
class Aside extends PureComponent {
  static propTypes = {
    firstInChain: PropTypes.bool.isRequired,
    image: PropTypes.string,
    images: PropTypes.array,
    friendlyTimestamp: PropTypes.string.isRequired,
    screen: PropTypes.object.isRequired
  }

  static defaultProps = {
    images: []
  }

  static contextTypes = {
    preRenderingMeasure: PropTypes.bool.isRequired
  }

  render() {
    const {
      props: { firstInChain, friendlyTimestamp, images, image, screen: { width } },
      context: { preRenderingMeasure }
    } = this
    
    return (
      <div className={styles.aside}>
        {firstInChain ? <div style={{backgroundImage: `url(${!preRenderingMeasure && findImageFromImages(images, image, width)})`}} className={styles.profile_pic} /> : (
          <span className={styles.time}>
            {friendlyTimestamp}
          </span>
        )}
      </div>
    )
  }
}
