import React from 'react'
import annotations from 'emoji-annotation-to-unicode'
import { getEscapedKeys } from './helpers'
import { v1 as uuid } from 'node-uuid'
import { Emoji as InlineEmoji } from 'components/chat/message/inline.react'

const _getKey = key => key.match(/^:.*:$/) ? key.replace(/^:|:$/g, '') : key

export function matchEmoji(match, messageReplacementDict) {
  const key = _getKey(match)
  const hex = this._emojiRegex.hex[key]
  const isCustom = hex && hex.startsWith('http')
  let parsed = match
  if (hex) {
    const replacement = uuid()
    messageReplacementDict[replacement] = <InlineEmoji hex={hex} custom={isCustom} key={replacement} name={key} />
    parsed = replacement
  }
  return { parsed, messageReplacementDict }
}

export function onEmojiChange(data) {
  console.log("EMOJI CHANGE", data)
  let emojiList = this._emojiRegex.hex
  if (data.subtype == 'remove') data.names.forEach(emoji => delete emojiList[emoji])
  else if (data.subtype == 'add') {
    let value = data.value.startsWith('alias:') ? emojiList[data.value.split(':')[1]] : data.value
    emojiList[data.name] = value
  }
  this._emojiRegex = updateEmojiRegex(emojiList)
}

export function setEmojis(emojis) {
  let emojiList = Object.assign({}, annotations, emojis)
  _.forEach(emojiList, (value, key) => {
    if (value.startsWith('alias:')) emojiList[key] = emojiList[value.split(':')[1]]
  })
  this._emojiRegex = updateEmojiRegex(emojiList)
}

export function updateEmojiRegex(emojiList = annotations) {
  return {
    delimiter: new RegExp(`(:(?:${getEscapedKeys(emojiList)}):)`, 'g'),
    hex: emojiList
  }
}
