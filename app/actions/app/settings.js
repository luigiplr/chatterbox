export const APP_SETTINGS_LOAD = 'APP_SETTINGS_LOAD'
export const APP_SETTINGS_LOAD_SUCCESS = 'APP_SETTINGS_LOAD_SUCCESS'
export const APP_SETTINGS_LOAD_FAIL = 'APP_SETTINGS_LOAD_FAIL'

export function loadSettings() {
  return async(dispatch) => {
    dispatch({ type: APP_SETTINGS_LOAD })

  }
}
