import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectReddit, fetchPostsIfNeeded, invalidateReddit, fetchNets, selectNetwork } from '../actions'
import Picker from '../components/Picker'
import Posts from '../components/Posts'


class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.handleNetChange = this.handleNetChange.bind(this)
  }

  componentDidMount() {
    console.log("mounted")
    const { dispatch, selectedReddit, nets, selectedNetwork } = this.props
    dispatch(fetchPostsIfNeeded(selectedReddit))
    dispatch(fetchNets())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedReddit !== this.props.selectedReddit) {
      const { dispatch, selectedReddit } = nextProps
      dispatch(fetchPostsIfNeeded(selectedReddit))
    }

    if (nextProps.selectedNetwork !== this.props.selectedNetwork) {
      const {dispatch, selectedNetwork} = nextProps
      this.handleNetChange(nextProps.selectedNetwork)
    }
  }

  handleChange(nextReddit) {
    this.props.dispatch(selectReddit(nextReddit))
  }

  handleNetChange(nextNet){
    console.log("on change", nextNet)
    this.props.dispatch(selectNetwork(nextNet));
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedReddit } = this.props
    dispatch(invalidateReddit(selectedReddit))
    dispatch(fetchPostsIfNeeded(selectedReddit))
  }

  render() {
    const { selectedReddit, posts, isFetching, lastUpdated, nets, selectedNetwork } = this.props
    const isEmpty = posts.length === 0
    return (
      <div>


        <Picker value={selectedNetwork}
                onChange={this.handleNetChange}
                options={nets.nets} />        
        <hr/>

        <Picker value={selectedReddit}
                onChange={this.handleChange}
                options={[ 'reactjs', 'frontend' ]} />

        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <a href="#"
               onClick={this.handleRefreshClick}>
              Refresh
            </a>
          }
        </p>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Posts posts={posts} />
            </div>
        }
      </div>
    )
  }
}

App.propTypes = {
  selectedReddit: PropTypes.string.isRequired,
  selectedNetwork: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  nets: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedReddit, postsByReddit, nets, selectedNetwork } = state
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsByReddit[selectedReddit] || {
    isFetching: true,
    items: []
  }

  return {
    selectedReddit,
    selectedNetwork,
    posts,
    nets,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)
