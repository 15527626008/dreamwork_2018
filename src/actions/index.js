const REQUEST = 'REQUEST'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
		acc[type] = `${base}_${type}`
		return acc
	}, {})
}

export const USER = createRequestTypes('USER')
export const REPO = createRequestTypes('REPO')
export const STARRED = createRequestTypes('STARRED')
export const STARGAZERS = createRequestTypes('STARGAZERS')
export const LOADEXPRESSINFO = createRequestTypes('LOADEXPRESSINFO')

export const UPDATE_ROUTER_STATE = 'UPDATE_ROUTER_STATE'
export const NAVIGATE =  'NAVIGATE'
export const LOAD_USER_PAGE = 'LOAD_USER_PAGE'
export const LOAD_REPO_PAGE = 'LOAD_REPO_PAGE'
export const LOAD_MORE_STARRED = 'LOAD_MORE_STARRED'
export const LOAD_MORE_STARGAZERS = 'LOAD_MORE_STARGAZERS'
export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

export const CHANGE_THEME = 'CHANGE_THEME'
export const EXPRESS_INFO_CHANGE = 'EXPRESS_INFO_CHANGE'
export const LOAD_EXPRESS_INFO  = 'LOAD_EXPRESS_INFO'

function action(type, payload = {}) {
  return {type, ...payload}
}


export const user = {
  request: login => action(USER[REQUEST], {login}),
  success: (login, response) => action(USER[SUCCESS], {login, response}),
  failure: (login, error) => action(USER[FAILURE], {login, error}),
}

export const repo = {
  request: fullName => action(REPO[REQUEST], {fullName}),
  success: (fullName, response) => action(REPO[SUCCESS], {fullName, response}),
  failure: (fullName, error) => action(REPO[FAILURE], {fullName, error}),
}

export const starred = {
  request: login => action(STARRED[REQUEST], {login}),
  success: (login, response) => action(STARRED[SUCCESS], {login, response}),
  failure: (login, error) => action(STARRED[FAILURE], {login, error}),
}

export const stargazers = {
  request: fullName => action(STARGAZERS[REQUEST], {fullName}),
  success: (fullName, response) => action(STARGAZERS[SUCCESS], {fullName, response}),
  failure: (fullName, error) => action(STARGAZERS[FAILURE], {fullName, error}),
}

// export const express = {

//   request: expressInfo => action(LOADEXPRESSINFO[REQUEST],{expressInfo}),
//   success: (expressInfo,response) => action(LOADEXPRESSINFO[SUCCESS],{expressInfo,response}),
//   failure: (expressInfo, error) => action(LOADEXPRESSINFO[FAILURE], {expressInfo, error}),
// }

export const updateRouterState = state => action(UPDATE_ROUTER_STATE, {state})
export const navigate = pathname => action(NAVIGATE, {pathname})
export const loadUserPage = (login, requiredFields = []) => action(LOAD_USER_PAGE, {login, requiredFields})
export const loadRepoPage = (fullName, requiredFields = []) => action(LOAD_REPO_PAGE, {fullName, requiredFields})
export const loadMoreStarred = login => action(LOAD_MORE_STARRED, {login})
export const loadMoreStargazers = fullName => action(LOAD_MORE_STARGAZERS, {fullName})
export const loadExpressInfo = express => action(LOAD_EXPRESS_INFO,{express})
export const changeThemeColor = color =>action(CHANGE_THEME,{color})
export const expressInfoChange = express => action(EXPRESS_INFO_CHANGE,{express})

export const resetErrorMessage = () => action(RESET_ERROR_MESSAGE)

