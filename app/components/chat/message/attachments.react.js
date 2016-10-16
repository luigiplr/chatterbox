import React, { PureComponent, PropTypes } from 'react'
import ImageLoader from 'react-imageloader'
import classnames from 'classnames'
import { compact } from 'lodash'
import { autobind } from 'core-decorators'
import VideoPlayer from 'react-player'
import { extractImageDimentions } from './helpers'
import styles from 'styles/partials/chat/message/attachments.scss'

export default class Attachments extends PureComponent {
  static propTypes = {
    attachments: PropTypes.array.isRequired
  }

  @autobind
  _renderAttachments({ text, borderColor = 'gray', pretext, title, links = {}, images = {}, video, author, service, fields }) {
    const renderSidebar = !(!text && !pretext && !title && !images.thumb && !video && !author && !fields)

    return compact([
      pretext && <Text key='pretext' text={pretext} />,
      <div key='attachment-container' className={classnames(styles.attachment_body_container, {withThumb: images.thumb})}>
        {renderSidebar && <div className={styles.sidebar} style={{ backgroundColor: borderColor }} />}
        <div className={styles.attachment_body}>
          {author && <Author name={author} image={images.author} link={links.author} service={{ name: service, image: images.service }} />}
          {text && <Text isPretext={false} text={text} />}
          {fields && <Fields data={fields} />}
          {video && <Video {...video} />}
        </div>
      </div>,
      images.image && <Image key='image' {...images.image} />,
      images.thumb && !video && <Thumb key='thumb-image' url={images.thumb.url} />,
    ])
  }

  render() {
    const { attachments } = this.props
    if(!attachments.length) return null

    return (
      <div className={styles.attachments_container}>
        {attachments.map(({key, ...attachment}, idx) => (
          <div key={idx+1} className={styles.attachment_container}>
            {this._renderAttachments(attachment)}
          </div>
        ))}
      </div>
    )
  }
}

function Image({ url, width, height }, { preRenderingMeasure }) {
  const { width: parsedWidth, height: parsedHeight } = extractImageDimentions(width, height)
  return (
    <div className={styles.bigImage} style={{ maxWidth: `${parsedWidth}px`, height: `${parsedHeight}px` }}>
      {!preRenderingMeasure && <ImageLoader src={url} />}
    </div>
  )
}

function Text({ text, isPretext = true }) {
  return (
    <div className={classnames(styles.text, {[styles.pretext] : isPretext})}>
      {text}
    </div>
  )
}

function Thumb({ url }, { preRenderingMeasure }) {
  return (
    <div className={styles.thumb_container}>
      <div className={styles.thumb} style={{backgroundImage: `url(${!preRenderingMeasure && url})`}} />
    </div>
  )
}

function Fields({ data }) { // eslint-disable-line react/prop-types
  return (
    <div className={styles.fields_container}>
      {data.map(({short, value = '', title = ''}, i) => (
        <div key={i+1} className={classnames(styles.field, { [styles.short]: styles })}>
          <h3>{title}</h3>
          <p>{value}</p>
        </div>
      ))}
    </div>
  )
}

function Author({ name, link, image, service = {} }, { preRenderingMeasure }){
  const { image: serviceImage, name: serviceName } = service
  return (
    <div className={styles.author_container}>
      {serviceImage && <div className={styles.img} style={{backgroundImage: `url(${!preRenderingMeasure && serviceImage})`}} />}
      {serviceName && <div className={styles.serviceName}>{serviceName}{name && ' |'}</div>}
      {image && <div className={styles.img} style={{backgroundImage: `url(${!preRenderingMeasure && image})`}} />}
      {name && <div className={styles.name}>{name}</div>}
    </div>
  )
}

function Video({ url, width, height, type }, { preRenderingMeasure }) {
  return (
    <div style={{ width: width > 500 ? 500 : width, height: height > 375 ? 375 : height}} className={styles.video_container}>
      {!preRenderingMeasure && (
        <VideoPlayer
          className={styles.player}
          url={url}
          controls
        />
      )}
    </div>
  )
}
