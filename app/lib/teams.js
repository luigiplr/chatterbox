import { readJsonSync, outputJsonSync, outputJson } from 'fs-extra'
import { join } from 'path'

export function saveTeams(teams) {
  outputJsonSync(join(global._userDataPath, 'teams.json'), teams)
}

export function getTeams() {
  const teamsJSONPath = join(global._userDataPath, 'teams.json')
  try {
    return readJsonSync(teamsJSONPath, { throws: false })
  } catch (err) {
    console.info('No valid teams.json detected, creating one.')
    outputJson(settingsJSONPath, {})
    return {}
  }
}
