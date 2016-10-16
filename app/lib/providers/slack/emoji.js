import React from 'react'
import annotations from 'emoji-annotation-to-unicode'
import { getEscapedKeys } from './helpers'
import { v1 as uuid } from 'node-uuid'
import { Emoji as InlineEmoji } from 'components/chat/message/inline.react'

const _getKey = key => key.match(/^:.*:$/) ? key.replace(/^:|:$/g, '') : key

export function matchEmoji(match, messageReplacementDict) {
  const key = _getKey(match)
  const hex = this._emojiRegex.hex[key]
  // const url = this._emojiRegex.url[key]
  let parsed = match
  if (hex) {
    const replacement = uuid()
    messageReplacementDict[replacement] = <InlineEmoji hex={hex} key={replacement} name={key} />
    parsed = replacement
  }
  return { parsed, messageReplacementDict }
}

export default function emojiRegex(customEmoji) {
  return {
    delimiter: new RegExp(`(:(?:${getEscapedKeys(annotations)}):)`, 'g'),
    hex: annotations,
    // url
  }
}
