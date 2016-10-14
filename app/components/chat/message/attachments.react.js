import React from 'react'
import styles from 'styles/partials/chat/message/attachments.scss'

export function Thumb({ url }) {
  return (
    <div className={styles.thumb_container}>
      <div className={styles.thumb} style={{backgroundImage: `url(${url})`}} />
    </div>
  )
}

export function Fields({ data }) { // eslint-disable-line react/prop-types
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

export function Author({ name, link, image, service = {} }){
  const { image: serviceImage, name: serviceName } = service
  return (
    <div className={styles.author_container}>
      {serviceImage && <div className={styles.image} style={{backgroundImage: `url(${serviceImage})`}} />}
      {serviceName && <div className={styles.serviceName}>{serviceName}{name && ' |'}</div>}
      {image && <div className={styles.image} style={{backgroundImage: `url(${image})`}} />}
      {name && <div className={styles.name}>{name}</div>}
    </div>
  )
}
