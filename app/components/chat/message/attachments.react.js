import React from 'react'
import styles from 'styles/partials/chat/message/attachments.scss'

export function Thumb({ url }) {
  return (
    <div className={styles.thumb_container}>
      <div className={styles.thumb} style={{backgroundImage: `url(${url})`}} />
    </div>
  )
}
