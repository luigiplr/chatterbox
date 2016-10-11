import { readJsonSync, outputJsonSync, ensureDirSync } from 'fs-extra'
import { join } from 'path'
import { remote } from 'electron'

const userData = remote.app.getPath('userData')
ensureDirSync(userData)

export function saveTeams(teams) {
  outputJsonSync(join(userData, 'teams.json'), teams)
}

export function getTeams() {
  try {
    return readJsonSync(join(userData, 'teams.json'), { throws: false })
  } catch (err) {
    return {}
  }
}
