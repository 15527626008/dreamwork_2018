import { combineReducers } from 'redux'
import * as ActionTypes from '../actions'
import merge from 'lodash/merge'
import paginate from './paginate'

// Updates an entity cache in response to any action with response.entities.
function entities(state = { users: {}, repos: {} }, action) {
    
    if (action.response && action.response.entities) {
      return merge({}, state, action.response.entities)
    }
  
    return state
}

// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
    const { type, error } = action
  
    if (type === ActionTypes.RESET_ERROR_MESSAGE) {
      return null
    } else if (error) {
      return action.error
    }
  
    return state
  }

// Updates the pagination data for different actions.
const pagination = combineReducers({
    starredByUser: paginate({
      mapActionToKey: action => action.login,
      types: [
        ActionTypes.STARRED.REQUEST,
        ActionTypes.STARRED.SUCCESS,
        ActionTypes.STARRED.FAILURE
      ]
    }),
    stargazersByRepo: paginate({
      mapActionToKey: action => action.fullName,
      types: [
        ActionTypes.STARGAZERS.REQUEST,
        ActionTypes.STARGAZERS.SUCCESS,
        ActionTypes.STARGAZERS.FAILURE
      ]
    })
  })
  
function router(state = { pathname: '/' }, action) {
    switch (action.type) {
      case ActionTypes.UPDATE_ROUTER_STATE:
        return action.state
      default:
        return state
    }
  }
// Takes care of changing the application state
function reducer (state = {}, action) {
    switch (action.type) {
      case ActionTypes.CHANGE_THEME:
       
        return {...state, color: action.color}
      case ActionTypes.EXPRESS_INFO_CHANGE:
    
        return {...state,express:action.express}//merge({}, state, action.response.entities)//
      default:
        return state
    }
  }

const rootReducer = combineReducers({
    entities,
    errorMessage,
    router,
    pagination,
    reducer
})

export default rootReducer