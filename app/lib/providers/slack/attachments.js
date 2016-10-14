import formatter from './formatter'
import { map } from 'lodash'

export default function santitizeAttachments(attachments) {
  if(!attachments || !attachments.length) return []
  return attachments.map((rawAttachment) => {
    const { title, title_link, text, pretext, color, fields, mrkdwn_in = [], ...attachment } = rawAttachment
    return {
      images: extractImages(attachment),
      video: extractVideo(attachment),
      links: {
        author: attachment.author_link,
        title: title_link && formatter.bind(this)(title_link)
      },
      author: attachment.author_name,
      service: attachment.service_name,
      borderColor: color && `#${color}`,
      title: title && formatter.bind(this)(title),
      pretext: mrkdwn_in.includes('pretext') ? formatter.bind(this)(pretext) : pretext,
      text: mrkdwn_in.includes('text') ? formatter.bind(this)(text) : text,
      fields: mrkdwn_in.includes('fields') ? map(fields, field => {
        field.value = formatter.bind(this)(field.value)
        return field
      }) : fields
    }
  })
}

function extractVideo(attachment) {
  const { video_html, service_name, video_url, from_url, video_html_height, video_html_width } = attachment
  return video_html && {
    type: service_name,
    url: video_url || from_url,
    height: video_html_height,
    width: video_html_width
  }
}

function extractImages(attachment) {
  const { image_url, image_height, image_width, image_bytes } = attachment
  const image = image_url && {
    url: image_url,
    height: image_height,
    width: image_width,
    size: image_bytes
  }

  const { thumb_url, thumb_height, thumb_width } = attachment
  const thumb = thumb_url && {
    url: thumb_url,
    height: thumb_height,
    width: thumb_width
  }

  return { thumb, image, author: attachment.author_icon, service: attachment.service_icon }
}
