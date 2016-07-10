import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectReddit, fetchPostsIfNeeded, invalidateReddit, fetchNets, selectNetwork, fetchWeeks, selectWeek, fetchAPIData} from '../actions'
import Picker from '../components/Picker'
import Posts from '../components/Posts'
import ComparisonBox from '../components/ComparisonBox'
import GraphBox from '../components/GraphBox'


class App extends Component {
  constructor(props) {
    super(props)
    //this.handleChange = this.handleChange.bind(this)
    //this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.handleNetChange = this.handleNetChange.bind(this)
    this.handleWeekChange = this.handleWeekChange.bind(this)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
  }  

  componentDidMount() {
    console.log("mounted")
    const { dispatch, selectedReddit, nets, selectedNetwork } = this.props
    //dispatch(fetchPostsIfNeeded(selectedReddit))
    dispatch(fetchNets())
    dispatch(fetchWeeks())
  }

  componentWillReceiveProps(nextProps) {
    /*
    if (nextProps.selectedReddit !== this.props.selectedReddit) {
      const { dispatch, selectedReddit } = nextProps
      dispatch(fetchPostsIfNeeded(selectedReddit))
    }
*/
    if (nextProps.selectedNetwork !== this.props.selectedNetwork) {
      const {dispatch, selectedNetwork} = nextProps
      this.handleNetChange(nextProps.selectedNetwork)
    }

    if (nextProps.selectedWeek !== this.props.selectedWeek) {
      const {dispatch, selectedWeek} = nextProps
      this.handleWeekChange(nextProps.selectedWeek)
    }

  }
/*
  handleChange(nextReddit) {
    this.props.dispatch(selectReddit(nextReddit))
  }
*/

  handleNetChange(nextNet){
    console.log("on change", nextNet)
    this.props.dispatch(selectNetwork(nextNet))
  }

  handleWeekChange(nextWk){
    this.props.dispatch(selectWeek(nextWk))
  }

/*
  handleRefreshClick(e) {
    e.preventDefault()
    const { dispatch, selectedReddit } = this.props
    dispatch(invalidateReddit(selectedReddit))
    dispatch(fetchPostsIfNeeded(selectedReddit))
  }
*/

  handleSubmitClick(e){
    e.preventDefault()
    const{dispatch} = this.props
    dispatch(fetchAPIData('http://rockthecatzva.com/slim-tracker/api/getweeklyratings/?net%5B%5D='+this.props.selectedNetwork+'&metric=aa&stream%5B%5D=lsd&demo%5B%5D=p55&starttime='+this.props.selectedWeek+'&weeks=7', 'Weekly7-P55-LSD'))
    dispatch(fetchAPIData('http://rockthecatzva.com/slim-tracker/api/getweeklyratings/?net%5B%5D='+this.props.selectedNetwork+'&metric=aa&stream%5B%5D=lsd&demo%5B%5D=p2_17&starttime='+this.props.selectedWeek+'&weeks=7', 'Weekly7-P2_17-LSD'))
    dispatch(fetchAPIData('http://localhost:8888/tvgrid-redux/api/getaverage?net='+this.props.selectedNetwork+'&metric=imp&demo=p2&starttime='+this.props.selectedWeek+'&stream=l7d&weeks=1', 'Week1-P2-L7D-IMP'))
    dispatch(fetchAPIData('http://localhost:8888/tvgrid-redux/api/getaverage?net='+this.props.selectedNetwork+'&metric=imp&demo=p2&starttime='+this.props.selectedWeek+'&stream=l7d&weeks=6', 'Week6-P2-L7D-IMP'))//THIS NEEDS TO exclude the current week
  }

  render() {
    const { selectedReddit, posts, isFetching, lastUpdated, nets, selectedNetwork, selectedWeek, weeks, ratings } = this.props
    const isEmpty = posts.length === 0
    console.log("WEEK IS ", selectedWeek)
    //const t = ratings.hasOwnProperty('Week1-P2-L7D-IMP') ? ratings['Week1-P2-L7D-IMP'] : 0
//console.log("here it is: ", ratings['Week1-P2-L7D-IMP']['rating_avg'], ratings['Week1-P2-L7D-IMP'])

    return (
      <div>
        <Picker value={selectedNetwork}
                onChange={this.handleNetChange}
                options={nets.nets} />

        <Picker value={selectedWeek}
                onChange={this.handleWeekChange}
                options={weeks.weeks} /> 
        
        <button type="button" onClick={this.handleSubmitClick} >Submit</button>


        <ComparisonBox label1="P2+ L7 IMP vs." value1={parseInt(ratings['Week1-P2-L7D-IMP']['rating_avg'])} value2={parseInt(ratings['Week6-P2-L7D-IMP']['rating_avg'])} />
        <GraphBox height={400} width={600} set1={ratings['Weekly7-P55-LSD']} graphData={[ratings['Weekly7-P55-LSD'], ratings['Weekly7-P2_17-LSD']]}/>

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
