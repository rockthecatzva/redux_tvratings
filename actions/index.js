import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const REQUEST_NETS = 'REQUEST_NETS'
export const REQUEST_WEEKS = 'REQUEST_WEEKS'
export const REQUEST_DATA = 'REQUEST_DATA'

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const RECEIVE_NETS = 'RECEIVE_NETS'
export const RECEIVE_WEEKS = 'RECEIVE_WEEKS'
export const RECEIVE_DATA = 'RECEIVE_DATA'

export const SELECT_REDDIT = 'SELECT_REDDIT'
export const SELECT_NETWORK = 'SELECT_NETWORK'
export const SELECT_WEEK = 'SELECT_WEEK'

export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'
export const IS_FETCHING = 'IS_FETCHING'
export const INCREMENT_RX = 'INCREMENT_RX'
export const INCREMENT_TX = 'INCREMENT_TX'


/*
export function selectReddit(reddit) {
  return {
    type: SELECT_REDDIT,
    reddit
  }
}
*/

/*
 export function setFetching(){
  return{
    type: IS_FETCHING
  }
}

 export function incrRxCount(){
  return{
    type: INCREMENT_RX
  }
}

export function incrTxCount(){
  return{
    type: INCREMENT_TX
  }
}

*/

function requestData(treeparent){
  return{
    type: REQUEST_DATA,
    treeparent
  }
}


export function selectNetwork(net){
  return{
    type: SELECT_NETWORK,
    selectedNetwork: net
  }
}

export function selectWeek(wk){
  return {
    type: SELECT_WEEK,
    selectedWeek: wk
  }
}

/*
export function invalidateReddit(reddit) {
  return {
    type: INVALIDATE_REDDIT,
    reddit
  }
}

function requestPosts(reddit) {
  return {
    type: REQUEST_POSTS,
    reddit
  }
}


function receivePosts(reddit, json) {
  return {
    type: RECEIVE_POSTS,
    reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}
*/

function receiveNets(data) {
  return {
    type: RECEIVE_NETS,
    nets: data.map(ob => ob.net),
    selectedNetwork: data[0].net
  }
}

function receiveWeeks(data){
  return{
    type: RECEIVE_WEEKS,
    weeks: data.map(ob=> ob.date_time),
    selectedWeek: data[0].date_time
  }
}

/*
function fetchPosts(reddit) {
  return dispatch => {
    dispatch(requestPosts(reddit))
    //console.log(reddit)
    return fetch('https://www.reddit.com/r/'+reddit+'.json')
      .then(response => response.json())
      .then(json => dispatch(receivePosts(reddit, json)))
  }
}
*/


export function fetchNets() {
  return dispatch => {
   // dispatch(requestNets)
    return fetch('http://localhost:8888/api-tvratings-phpslim/getnets')
      .then(response => response.json())
      .then(json => dispatch(receiveNets(json)))
  }
}

export function fetchWeeks() {
  return dispatch => {
    //dispatch(requestWeeks)
    return fetch('http://localhost:8888/api-tvratings-phpslim/getweeks')
      .then(response => response.json())
      .then(json => dispatch(receiveWeeks(json)))
  }
}


export function fetchAPIData(url, treeparent){
  return dispatch => {
    //fetch url data
    //dispatch(incrTxCount())
    dispatch(requestData(treeparent))
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(receiveAPIData(treeparent, json)))
  }
}

function receiveAPIData(treeparent, indata){
  //dispatch(incrRxCount())
  return{
    type: RECEIVE_DATA,
    treeparent,
    data: {"data": indata, "isFetching": false},//.map(indataob=> indata[indataob])
  }
}


function shouldFetchPosts(state, reddit) {
  const posts = state.postsByReddit[reddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export function fetchPostsIfNeeded(reddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), reddit)) {
      return dispatch(fetchPosts(reddit))
    }
  }
}
