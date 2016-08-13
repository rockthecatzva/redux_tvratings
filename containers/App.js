import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchNets, selectNetwork, fetchWeeks, selectWeek, fetchAPIData} from '../actions'
import Picker from '../components/Picker'
import ComparisonBox from '../components/ComparisonBox'
import GraphBox from '../components/GraphBox'
import TelecastRankerBox from '../components/TelecastRankerBox'



class App extends Component {
  constructor(props) {
    super(props)
    this.handleNetChange = this.handleNetChange.bind(this)
    this.handleWeekChange = this.handleWeekChange.bind(this)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
    
  }  

  componentDidMount() {
    const { dispatch, nets, selectedNetwork } = this.props
    dispatch(fetchNets())
    dispatch(fetchWeeks())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedNetwork !== this.props.selectedNetwork) {
      const {dispatch, selectedNetwork} = nextProps
      this.handleNetChange(nextProps.selectedNetwork)
    }

    if (nextProps.selectedWeek !== this.props.selectedWeek) {
      const {dispatch, selectedWeek} = nextProps
      this.handleWeekChange(nextProps.selectedWeek)
    }
  }

  handleNetChange(nextNet){
    this.props.dispatch(selectNetwork(nextNet))
  }

  handleWeekChange(nextWk){
    this.props.dispatch(selectWeek(nextWk))
  }

  
  handleSubmitClick(e){
    e.preventDefault()
    const{dispatch} = this.props
    //dispatch(setFetching(true))
    dispatch(fetchAPIData('http://localhost:8888/tvgrid-redux/api/getweeklyratings/?net%5B%5D='+this.props.selectedNetwork+'&metric=aa&stream%5B%5D=lsd&demo%5B%5D=p55&starttime='+this.props.selectedWeek+'&weeks=7', 'Weekly7-P55-LSD'))
    dispatch(fetchAPIData('http://localhost:8888/tvgrid-redux/api/getweeklyratings/?net%5B%5D='+this.props.selectedNetwork+'&metric=aa&stream%5B%5D=lsd&demo%5B%5D=p2_17&starttime='+this.props.selectedWeek+'&weeks=7', 'Weekly7-P2_17-LSD'))
    dispatch(fetchAPIData('http://localhost:8888/tvgrid-redux/api/getaverage?net='+this.props.selectedNetwork+'&metric=imp&demo=p2&starttime='+this.props.selectedWeek+'&stream=l7d&weeks=1', 'Week1-P2-L7D-IMP'))
    dispatch(fetchAPIData('http://localhost:8888/tvgrid-redux/api/getaverage?net='+this.props.selectedNetwork+'&metric=imp&demo=p2&starttime='+this.props.selectedWeek+'&stream=l7d&weeks=6', 'Week6-P2-L7D-IMP'))//THIS NEEDS TO exclude the current week
    dispatch(fetchAPIData('http://rockthecatzva.com/slim-tracker/api/getweeklylist/?net=FAKENET&metrics%5B%5D=aa&streams%5B%5D=lsd&demos%5B%5D=p25_54&demos%5B%5D=w25_54&starttime=2014-12-22&weeks=1', 'Weekly-Telecast-List'))
  }

  render() {
    const { nets, selectedNetwork, selectedWeek, weeks, ratings } = this.props
    
    //var rat = ratings['Week1-P2-L7D-IMP'];
    //console.log("check this", rat)

    return (
      <div>
      <div className="row">
        <div className="header-text col-sm-6 col-sm-offset-3">
          <Picker value={selectedNetwork}
                  onChange={this.handleNetChange}
                  options={nets.nets} />
          Weekly Report: Wk of

          <Picker value={selectedWeek}
                  onChange={this.handleWeekChange}
                  options={weeks.weeks} /> 
        </div>
      </div>  

      <div className="row">
        <button type="button" onClick={this.handleSubmitClick} >Submit</button>
      </div>


      <div className="row">
        <ComparisonBox label1="P2+ L7 IMP vs." value1={ratings['Week1-P2-L7D-IMP'] ? parseInt(ratings['Week1-P2-L7D-IMP']['data']['rating']):0 } value2={ratings['Week6-P2-L7D-IMP']?parseInt(ratings['Week6-P2-L7D-IMP']['data']['rating']):0} round={true} isFetching={ratings['Week6-P2-L7D-IMP']?ratings['Week6-P2-L7D-IMP']['isFetching']:true} />
      </div>

      <div className="row">
        <div className="col-sm-5 panel panel-default">
          <GraphBox height={300} width={500} graphData={(ratings['Weekly7-P55-LSD']&&ratings['Weekly7-P2_17-LSD'])?[ratings['Weekly7-P55-LSD']['data'], ratings['Weekly7-P2_17-LSD']['data']]:[0]} isFetching={(ratings['Weekly7-P2_17-LSD']&&ratings['Weekly7-P55-LSD'])?(ratings['Weekly7-P2_17-LSD']['isFetching']&&ratings['Weekly7-P55-LSD']['isFetching']):true} />
        </div>      
      </div>
      
  
      </div>
    )
  }
}

App.propTypes = {
  selectedNetwork: PropTypes.string.isRequired,
  selectedWeek: PropTypes.string.isRequired,
  weeks: PropTypes.object.isRequired,
  ratings: PropTypes.object.isRequired,
  nets: PropTypes.object.isRequired,
  //isFetching: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const {nets, selectedNetwork, selectedWeek, weeks, ratings } = state

  return {
    selectedNetwork,
    selectedWeek,
    nets,
    ratings,
    //isFetching,
    weeks
  }
}

export default connect(mapStateToProps)(App)
