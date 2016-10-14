import { screen } from 'electron'
import { forEach } from 'lodash'

export const APP_SCREEN_RESOLUTION_SET = 'APP_SCREEN_RESOLUTION_SET'

export function setAppScreenResolution() {
  return dispatch => {
    let biggestSize = { height: 0, width: 0 }
    screen.getAllDisplays().forEach(({ size }) =>
      forEach(size, (value, key) => {
        if(biggestSize[key] < value) {
          biggestSize[key] = value
        }
      })
    )
    dispatch({ type: APP_SCREEN_RESOLUTION_SET, payload: biggestSize })
  }
}
