import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectReddit, fetchPostsIfNeeded, invalidateReddit, fetchNets, selectNetwork, fetchWeeks, selectWeek, fetchAPIData} from '../actions'
import Picker from '../components/Picker'
import Posts from '../components/Posts'
import ComparisonBox from '../components/ComparisonBox'
import ComparisonBoxContainer from '../containers/ComparisonBoxContainer'


class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.handleNetChange = this.handleNetChange.bind(this)
    this.handleWeekChange = this.handleWeekChange.bind(this)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
  }

  componentDidMount() {
    console.log("mounted")
    const { dispatch, selectedReddit, nets, selectedNetwork } = this.props
    dispatch(fetchPostsIfNeeded(selectedReddit))
    dispatch(fetchNets())
    dispatch(fetchWeeks())
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

    if (nextProps.selectedWeek !== this.props.selectedWeek) {
      const {dispatch, selectedWeek} = nextProps
      this.handleWeekChange(nextProps.selectedWeek)
    }

  }

  handleChange(nextReddit) {
    this.props.dispatch(selectReddit(nextReddit))
  }

  handleNetChange(nextNet){
    console.log("on change", nextNet)
    this.props.dispatch(selectNetwork(nextNet))
  }

  handleWeekChange(nextWk){
    this.props.dispatch(selectWeek(nextWk))
    console.log("THis", this)
  }


  handleRefreshClick(e) {
    e.preventDefault()
    const { dispatch, selectedReddit } = this.props
    dispatch(invalidateReddit(selectedReddit))
    dispatch(fetchPostsIfNeeded(selectedReddit))
  }


  handleSubmitClick(e){
    console.log("THis", this)
    e.preventDefault()
    const{dispatch} = this.props
    dispatch(fetchAPIData('http://rockthecatzva.com/slim-tracker/api/getweeklyratings/?net%5B%5D=FAKENET&metric=aa&stream%5B%5D=lsd&demo%5B%5D=p55&starttime=2014-12-22&weeks=7', 'Weekly7-P55-LSD', ['date_time', 'rating_avg']))
    dispatch(fetchAPIData('http://rockthecatzva.com/slim-tracker/api/getweeklyratings/?net%5B%5D=FAKENET&metric=aa&stream%5B%5D=lsd&demo%5B%5D=p2_17&starttime=2014-12-22&weeks=7', 'Weekly7-P2_17-LSD', ['date_time', 'rating_avg']))
    dispatch(fetchAPIData('http://rockthecatzva.com/slim-tracker/api/getaverage?net=FAKENET&metric=imp&demo=p2&starttime=2014-12-22&stream=l7d&weeks=1', 'Week1-P2-L7D-IMP', ['rating_avg']))
  }

  render() {
    const { selectedReddit, posts, isFetching, lastUpdated, nets, selectedNetwork, selectedWeek, weeks, ratings } = this.props
    const isEmpty = posts.length === 0
    return (
      <div>


        <Picker value={selectedNetwork}
                onChange={this.handleNetChange}
                options={nets.nets} />

        <Picker value={selectedWeek}
                onChange={this.handleWeekChange}
                options={weeks.weeks} /> 

        <ComparisonBox label1="Test Values" value1={ratings['Week1-P2-L7D-IMP']} value2={3} />

        <button type="button" onClick={this.handleSubmitClick} >Submit</button>

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
  selectedWeek: PropTypes.string.isRequired,
  weeks: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  ratings: PropTypes.object.isRequired,
  nets: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedReddit, postsByReddit, nets, selectedNetwork, selectedWeek, weeks, ratings } = state
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
    selectedWeek,
    posts,
    nets,
    ratings,
    isFetching,
    lastUpdated,
    weeks
  }
}

export default connect(mapStateToProps)(App)
