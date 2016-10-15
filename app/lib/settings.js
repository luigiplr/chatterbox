import { readJsonSync, outputJsonSync, outputJson, ensureDirSync } from 'fs-extra'
import { join } from 'path'
import { remote } from 'electron'

const defaultUserDataPath = remote.app.getPath('userData')

export function saveSettings() {

}

export function readSettings() {
  const settingsJSONPath = join(global._userDataPath, 'settings.json')
  try {
    return readJsonSync(settingsJSONPath, { throws: false })
  } catch (err) {
    console.info('No valid settings.json detected, creating one.')
    outputJson(settingsJSONPath, {})
    return {}
  }
}

export function getUserDataPath() {
  const userData = defaultUserDataPath
  ensureDirSync(userData)
  return userData
}

export function setUserDataPath(newPath) {
  global._userDataPath = newPath
  ensureDirSync(newPath)
  return userData
}
