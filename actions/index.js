import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const REQUEST_NETS = 'REQUEST_NETS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const RECEIVE_NETS = 'RECEIVE_NETS'
export const SELECT_REDDIT = 'SELECT_REDDIT'
export const SELECT_NETWORK = 'SELECT_NETWORK'
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'

export function selectReddit(reddit) {
  return {
    type: SELECT_REDDIT,
    reddit
  }
}

export function selectNetwork(net){
  return{
    type: SELECT_NETWORK,
    selectedNetwork: net
  }
}


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

function requestNets() {
  return {
    type: REQUEST_NETS
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

function receiveNets(data) {
  return {
    type: RECEIVE_NETS,
    nets: data.map(ob => ob.net),
    selectedNetwork: data[0].net
  }
}


function fetchPosts(reddit) {
  return dispatch => {
    dispatch(requestPosts(reddit))
    console.log(reddit)
    return fetch('https://www.reddit.com/r/'+reddit+'.json')
      .then(response => response.json())
      .then(json => dispatch(receivePosts(reddit, json)))
  }
}

export function fetchNets() {
  return dispatch => {
    dispatch(requestNets)
    console.log("getting networks!")
    return fetch('http://rockthecatzva.com/slim-tracker/api/getnets')
      .then(response => response.json())
      .then(json => dispatch(receiveNets(json)))
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
