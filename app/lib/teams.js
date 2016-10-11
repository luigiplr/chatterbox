import { readJsonSync, outputJsonSync } from 'fs-extra'
import { join } from 'path'
import { app } from 'electron'

const userData = app.getPath('userData')

export function saveTeams(teams) {
  outputJsonSync(join(userData, 'teams.json'), teams)
}

export function getTeams() {
  return readJsonSync(join(userData, 'teams.json'), { throws: false })
}
