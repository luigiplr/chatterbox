import React from 'react'
import { compact, isEmpty, unescape } from 'lodash'
import { getEscapedKeys } from './helpers'
import replace from 'frep'
import { v1 as uuid } from 'node-uuid'
import { matchEmoji } from './emoji'
import {
  Code as InlineCode,
  Channel as InlineChannel,
  User as InlineUser,
  Link as InlineLink
 } from 'components/chat/message/inline.react'


const codeBlockRegex = /(^|\s|[_*\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])```([\s\S]*?)?```(?=$|\s|[_*\?\.,\-!\^;:})\]%$#+=\u2000-\u206F\u2E00-\u2E7F…"])/g
const codeRegex = /(^|\s|[\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])`(.*?\S *)?`/g

const userOrChannelRegex = /<[#@]+(.*?)>/g
const urlRegex = /<(.*?)>/g
const boldRegex = /(^|\s|[\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])\*(.*?\S *)?\*(?=$|\s|[\?\.,'\-!\^;:})\]%$~{\[<#+=\u2000-\u206F\u2E00-\u2E7F…"\uE022])/g
const italicRegex = /(?!:.+:)(^|\s|[\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])_(.*?\S *)?_(?=$|\s|[\?\.,'\-!\^;:})\]%$~{\[<#+=\u2000-\u206F\u2E00-\u2E7F…"\uE022])/g
const strikeRegex = /(^|\s|[\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])~(.*? *\S)?~(?=$|\s|[\?\.,'\-!\^;:})\]%$~{\[<#+=\u2000-\u206F\u2E00-\u2E7F…"\uE022])/g

// const quoteRegex = /(^|)&gt;(?![\W_](?:&lt;|&gt;|[\|\/\\\[\]{}\(\)Dpb](?=\s|$)))(([^]*)(&gt;[^]*)*)/g
// const longQuote = /(^|)&gt;&gt;&gt;([\s\S]*$)/


function reparseMatch(match, messageReplacementDict) {
  const delimiter = new RegExp(`(${getEscapedKeys(messageReplacementDict)})`, 'g')
  return compact(
    match.split(delimiter).map((word, index) => {
      const [match] = word.match(delimiter) || []
      if (match && messageReplacementDict[match]) {
        word = messageReplacementDict[match]
        delete messageReplacementDict[match]
      }
      return word
    })
  )
}

export default function formatter(text) {
  if (!text) return text
  const { _users, _channels } = this

  let messageReplacementDict = {}
  const replacements = [{
    pattern: urlRegex,
    replacement: (match) => {
      match = match.trim().slice(1, -1)
      if (match.length > 0) {
        const replacement = uuid()
        if (match.charAt(0) == '@' || match.charAt(0) == '#') return `<${match}>`
        let split = match.split('|')
        let label = split.length === 2 ? split[1] : split[0]
        let url = split[0]
        if (!url.match(/^(https?:\/\/)|(mailto:)/)) return match

        messageReplacementDict[replacement] = <InlineLink url={url} label={label} key={replacement} />
        return replacement
      }
      return match
    }
  }, {
    pattern: codeBlockRegex,
    replacement: (match) => {
      match = match.trim().slice(3, -3)
      if (match.length > 0) {
        const replacement = uuid()

        match = match.charAt(0) == '\n' ? match.substring(1) : match

        if (Object.keys(messageReplacementDict).length > 0) {
          match = reparseMatch(match, messageReplacementDict)
        }

        messageReplacementDict[replacement] = <InlineCode key={replacement} block={true} code={match} />
        return replacement
      }
      return match
    }
  }, {
    pattern: codeRegex,
    replacement: (match) => {
      match = match.trim().slice(1, -1)
      if (match.length > 0) {
        const replacement = uuid()

        if (Object.keys(messageReplacementDict).length > 0) {
          match = reparseMatch(match, messageReplacementDict)
        }

        messageReplacementDict[replacement] = <InlineCode key={replacement} code={match} />
        return replacement
      }
      return match
    }
  }, {
    pattern: boldRegex,
    replacement: (match) => {
      match = match.trim().slice(1, -1)
      if (match.length > 0) {
        const replacement = uuid()
        messageReplacementDict[replacement] = <b key={replacement}>{match}</b>
        return replacement
      }
      return match
    }
  }, {
    pattern: italicRegex,
    replacement: match => {
      match = match.trim().slice(1, -1)
      if (match.length > 0) {
        const replacement = uuid()
        messageReplacementDict[replacement] = <i key={replacement}>{match}</i>
        return ` ${replacement}`
      }
      return match
    }
  }, {
    pattern: strikeRegex,
    replacement: match => {
      match = match.trim().slice(1, -1)
      if (match.length > 0) {
        const replacement = uuid()
        messageReplacementDict[replacement] = <em key={replacement}>{match}</em>
        return replacement
      }
      return match
    }
  }, {
    pattern: userOrChannelRegex,
    replacement: match => {
      match = match.trim()
      if (match.length > 0) {
        const replacement = uuid()
        if (match.includes('<@')) {
          const user = match.replace(/<|>|@/g, '')
          if (_users[user]) {
            messageReplacementDict[replacement] = <InlineUser key={replacement} id={user} />
            return replacement
          }
          return match
        } else {
          const [channel] = match.replace(/<|>|#/g, '').split('|')
          if (_channels[channel]) {
            messageReplacementDict[replacement] = <InlineChannel key={replacement} id={channel} />
            return ` ${replacement}`
          }
          return match
        }
      }
      return match
    }
  }, {
    pattern: this._emojiRegex.delimiter,
    replacement: match => {
      const {
        parsed,
        messageReplacementDict: newMessageReplacementDict
      } = matchEmoji.bind(this)(match, messageReplacementDict)
      messageReplacementDict = newMessageReplacementDict
      return parsed
    }
  }]

  const formattedText = unescape(replace.strWithArr(text, replacements))
  if (isEmpty(messageReplacementDict)) return formattedText
  const delimiter = new RegExp(`(${getEscapedKeys(messageReplacementDict)})`, 'g')
  return compact(
    formattedText.split(delimiter).map((word, index) => {
      const [match] = word.match(delimiter) || []
      return match ? (messageReplacementDict[match] || word) : word
    })
  )
}
