import { combineReducers } from 'redux'
import {
  SELECT_REDDIT, INVALIDATE_REDDIT, RECEIVE_DATA,
  REQUEST_POSTS, RECEIVE_POSTS, RECEIVE_NETS, SELECT_NETWORK, RECEIVE_WEEKS, SELECT_WEEK
} from '../actions'

function selectedReddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_REDDIT:
      return action.reddit
    default:
      return state
  }
}

function selectedNetwork(state='init1', action){
  switch (action.type){
    case RECEIVE_NETS:
    case SELECT_NETWORK:
      return action.selectedNetwork
    default:
      return state
  }
}

function selectedWeek(state='def1', action){
  switch(action.type){
    case RECEIVE_WEEKS:
    case SELECT_WEEK:
      return action.selectedWeek
    default:
      return state
  }
}

function ratings(state={}, action){
  switch(action.type){
    case RECEIVE_DATA:
      return Object.assign({}, state, {
          [action.treeparent]: action.data
      })

    default:
      return state
  }
}


function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_REDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function postsByReddit(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_REDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.reddit]: posts(state[action.reddit], action)
      })
    default:
      return state
  }
}

function nets(state={nets:[], selectedNetwork:'init2'}, action){
  switch(action.type){
    case RECEIVE_NETS:
      console.log("reducer - ", action)
      return Object.assign({}, state, {
        nets: action.nets,
        selectedNetwork: selectedNetwork(state[action.selectedNetwork], action)
      })
    default:
      return state;
  }
}

function weeks(state={weeks:[], selectedWeek: 'def2'}, action){
  switch(action.type){
    case RECEIVE_WEEKS:
      return Object.assign({}, state, {
        weeks: action.weeks,
        selectedWeek: selectedWeek(state[action.selectedWeek], action)
      })
    default:
    return state;
  }
}


const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit,
  selectedNetwork,
  nets,
  weeks,
  selectedWeek,
  ratings
})

export default rootReducer
