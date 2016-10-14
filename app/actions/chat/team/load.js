export const TEAM_LOAD = 'TEAM_LOAD'
export const TEAM_LOAD_SUCCESS = 'TEAM_LOAD_SUCCESS'
export const TEAM_LOAD_FAIL = 'TEAM_LOAD_FAIL'

type TeamLoad = {
  id: string;
  image?: string;
}

export function teamLoad(data: TeamLoad): Object {
  return { type: TEAM_LOAD, payload: data }
}

type TeamLoadSuccess = {
  id: string;
  channels: Object;
  dms: Object;
  users: Object;
  team: Object;
}

export function teamLoadSuccess(data: TeamLoadSuccess): Object {
  return { type: TEAM_LOAD_SUCCESS, payload: data }
}

export function teamLoadFail(data) {
  return { type: TEAM_LOAD_FAIL, payload: data }
}
