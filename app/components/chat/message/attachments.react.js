import React from 'react'
import styles from 'styles/partials/chat/message/attachments.scss'

export function Thumb({ url }) {
  return (
    <div className={styles.thumb_container}>
      <div className={styles.thumb} style={{backgroundImage: `url(${url})`}} />
    </div>
  )
}


export default ({ data: fields }) => { // eslint-disable-line react/prop-types
  return (
    <div className='fields'>
      {fields.map(({short, value, title}, i) => (
        <div key={title} className={classnames('field', {short})}>
          <h3>{title || ''}</h3>
          <p>{value || ''}</p>
        </div>
      ))}
    </div>
  )
}
