import { filter, get } from 'lodash'

export function santitizeUser({ tz: timezone, id, deleted, profile, name: handle, presence }) {
  return {
    handle,
    name: get(profile, 'real_name_normalized', '').length > 0 ? profile.real_name_normalized : null,
    id,
    presence: presence === 'active' ? 'online' : 'offline',
    images: filter(profile, (data, key) => key.includes('image')),
    meta: { timezone, email: _.get(profile, 'email') }
  }
}
