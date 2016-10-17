import React from 'react'
import { forEach, omitBy, isNil } from 'lodash'
import annotations from 'emoji-annotation-to-unicode'
import { getEscapedKeys } from './helpers'
import { v1 as uuid } from 'node-uuid'
import { Emoji as InlineEmoji } from 'components/chat/message/inline.react'

const _getKey = key => key.match(/^:.*:$/) ? key.replace(/^:|:$/g, '') : key

export function matchEmoji(match, messageReplacementDict) {
  const key = _getKey(match)
  const [url, hex] = [this._emojiRegex.url[key], this._emojiRegex.hex[key]]
  let parsed = match
  if (hex || url) {
    const replacement = uuid()
    messageReplacementDict[replacement] = <InlineEmoji hex={hex} url={url} key={replacement} name={key} />
    parsed = replacement
  }
  return { parsed, messageReplacementDict }
}

export function onEmojiChange({ subtype, value, names, name }) {
  let { hex, url } = this._emojiRegex
  if (subtype == 'remove') {
    names.forEach(emoji => {
      if(hex[emoji]) delete hex[emoji]
      else if(url[emoji]) delete url[emoji]
    })
  } else if (subtype == 'add') {
    const allEmojis = { ...hex, ...url }

    if(value.startsWith('alias:')) {
      value = value.replace(/alias:/, '')
      if(allEmojis[value]) {
        value = allEmojis[value]
      }
    }

    if(value.includes('http')) {
      url[name] = value
      return
    }

    hex[name] = value
  }
  this._emojiRegex = updateEmojiRegex(hex, url, true)
}

export function setEmojis(emojis) {
  const [hexAnnotations, urlAnnotations] = [{}, {}]
  forEach(emojis, (value, key) => {
    if(value.startsWith('alias:')) {
      value = value.replace(/alias:/, '')
      if(emojis[value]) {
        urlAnnotations[key] = emojis[value]
        return
      }
      hexAnnotations[key] = value
      return
    }
    urlAnnotations[key] = value
  })
  this._emojiRegex = updateEmojiRegex(hexAnnotations, urlAnnotations)
}

export function updateEmojiRegex(hexAnnotations = {}, urlAnnotations = {}, annotationsIncluded = false) {
  const annotationsRelative = annotationsIncluded ? {} : annotations
  return {
    delimiter: new RegExp(`(:(?:${getEscapedKeys({ ...hexAnnotations, ...annotationsRelative, ...urlAnnotations })}):)`, 'g'),
    hex: { ...hexAnnotations, ...annotationsRelative },
    url: urlAnnotations
  }
}
