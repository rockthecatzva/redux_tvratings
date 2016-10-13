import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchNets, selectNetwork, fetchWeeks, selectWeek, fetchAPIData, fetchDates} from '../actions'
import Picker from '../components/Picker'
import ComparisonBox from '../components/ComparisonBox'
import GraphBox from '../components/GraphBox'
import BarsStartStop from '../components/BarsStartStop'
import TelecastListSimplest from '../components/TelecastListSimplest'



class App extends Component {
  constructor(props) {
    super(props)
    //this.handleNetChange = this.handleNetChange.bind(this)
    //this.handleWeekChange = this.handleWeekChange.bind(this)
    //this.handleSubmitClick = this.handleSubmitClick.bind(this)

  }

  componentDidMount() {
    const { dispatch, nets, selectedNetwork, dates } = this.props
    //dispatch(fetchNets())
    //dispatch(fetchWeeks())
    dispatch(fetchDates())
  }

  componentWillReceiveProps(nextProps) {
    //console.log("Got new props", nextProps)
    const { dispatch } = this.props// IS THIS KOSHER???

    if(nextProps.dates !== this.props.dates){
      console.log("FOUND NEW DATES", nextProps.dates.dates)
      dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/time.php/getWeeklyDaypartAverages/?net=APL&metric=aa&stream%5B%5D=lsd&demo%5B%5D=p55&starttime=APL&stream=l3d&demo=p25_54&metric=aa&starttime='+nextProps.dates.dates.start+'&daysin='+nextProps.dates.dates.daysin, 'Weekly-APL-QTD-P2554-L3D'))
      dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/time.php/getWeeklyDaypartAverages/?net=APL&metric=aa&stream%5B%5D=lsd&demo%5B%5D=p55&starttime=APL&stream=l3d&demo=p25_54&metric=aa&starttime='+nextProps.dates.dates.yagostart+'&daysin='+nextProps.dates.dates.daysin, 'Weekly-APL-YAGOQTD-P2554-L3D'))

      dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/time.php/getWeeklyDaypartAverages/?net=DISC&metric=aa&stream%5B%5D=lsd&demo%5B%5D=p55&starttime=APL&stream=l3d&demo=p25_54&metric=aa&starttime='+nextProps.dates.dates.start+'&daysin='+nextProps.dates.dates.daysin, 'Weekly-DISC-QTD-P2554-L3D'))
      dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/time.php/getWeeklyDaypartAverages/?net=DISC&metric=aa&stream%5B%5D=lsd&demo%5B%5D=p55&starttime=APL&stream=l3d&demo=p25_54&metric=aa&starttime='+nextProps.dates.dates.yagostart+'&daysin='+nextProps.dates.dates.daysin, 'Weekly-DISC-YAGOQTD-P2554-L3D'))


      dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/telecasts.php/getweeklylistbydemo/?net=APL&metric=aa&stream=l3d&demos%5B%5D=p25_54&demos%5B%5D=m25_54&demos%5B%5D=w25_54&starttime=2015-10-19&days=7&limitby=5', 'TelecastList-APL'))

      dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/time.php/getDaypartAverage?nets%5B%5D=APL&nets%5B%5D=DISC&nets%5B%5D=ID&nets%5B%5D=TLC&nets%5B%5D=DAM&nets%5B%5D=AHC&nets%5B%5D=VEL&nets%5B%5D=SCI&nets%5B%5D=OWN&nets%5B%5D=DLIF&nets%5B%5D=DFC&stream=l3d&demo=p25_54&metric=imp&starttime=2016-6-27&stoptime=2016-8-7&yagostart=2015-6-29&yagostop=2015-8-9', 'QTDPortfolioBarChart-DCI'))


    }

    /*
    if (nextProps.selectedNetwork !== this.props.selectedNetwork) {
      const {dispatch, selectedNetwork} = nextProps
      this.handleNetChange(nextProps.selectedNetwork)
    }

    if (nextProps.selectedWeek !== this.props.selectedWeek) {
      const {dispatch, selectedWeek} = nextProps
      this.handleWeekChange(nextProps.selectedWeek)
    }
    */
  }

/*
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
    dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/getweeklyratings/?net%5B%5D='+this.props.selectedNetwork+'&metric=aa&stream%5B%5D=lsd&demo%5B%5D=p55&starttime='+this.props.selectedWeek+'&weeks=7', 'Weekly7-P55-LSD'))
    dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/getweeklyratings/?net%5B%5D='+this.props.selectedNetwork+'&metric=aa&stream%5B%5D=lsd&demo%5B%5D=p2_17&starttime='+this.props.selectedWeek+'&weeks=7', 'Weekly7-P2_17-LSD'))
    dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/getaverage?net='+this.props.selectedNetwork+'&metric=imp&demo=p2&starttime='+this.props.selectedWeek+'&stream=l7d&weeks=1', 'Week1-P2-L7D-IMP'))
    dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/getaverage?net='+this.props.selectedNetwork+'&metric=imp&demo=p2&starttime='+this.props.selectedWeek+'&stream=l7d&weeks=6', 'Week6-P2-L7D-IMP'))//THIS NEEDS TO exclude the current week
    dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/getweeklylist/?net='+this.props.selectedNetwork+'&metrics%5B%5D=aa&streams%5B%5D=lsd&demos%5B%5D=p25_54&demos%5B%5D=w25_54&starttime='+this.props.selectedWeek+'&weeks=1', 'Weekly-Telecast-List'))


  }
*/


  render() {
    const { nets, selectedNetwork, selectedWeek, weeks, ratings, dates } = this.props

    //console.log(dates)
    var getData = function(dataname){
      if(ratings[dataname]){
        return ratings[dataname]["data"];
      }
      else{
        return [0];
      }
    }

    var totalFetching = function(nameset){
      var isFetching = true;
      { nameset.map(function(d,i){
          if (ratings[d]){
            isFetching = false;
          }
      })}
      return isFetching;
    }


    return (
      <div>
      <div>{dates.dates.label} thru {(parseInt(dates.dates.daysin)+1)/7} wks vs. Same wks YAGO</div>


      <div className="col-sm-10 panel panel-default">
        <div className="graph-title">QTD DCI Portfolio Performance vs. Same wks. YAGO</div>
        <BarsStartStop barData={getData('QTDPortfolioBarChart-DCI')} isFetching={totalFetching(["QTDPortfolioBarChart-DCI"])} />
      </div>



      <div className="row">
        <div className="col-sm-5 panel panel-default">
          <div className="graph-title">DISC</div>
          <GraphBox height={300} width={500} graphData={[getData('Weekly-DISC-QTD-P2554-L3D'), getData('Weekly-DISC-YAGOQTD-P2554-L3D')]} lineTags={["DISC-line","DISC-yago-line"]} isFetching={totalFetching(["Weekly-DISC-QTD-P2554-L3D", "Weekly-DISC-YAGOQTD-P2554-L3D"])} />
        </div>

        <div className="col-sm-5 panel panel-default">
          <div className="graph-title">APL</div>
          <GraphBox height={300} width={500} graphData={[getData('Weekly-APL-QTD-P2554-L3D'), getData('Weekly-APL-YAGOQTD-P2554-L3D')]} lineTags={["APL-line","APL-yago-line"]} isFetching={totalFetching(["Weekly-APL-QTD-P2554-L3D", "Weekly-APL-YAGOQTD-P2554-L3D"])} />
        </div>
      </div>







      <div className="row">
        <div className="col-sm-6 panel panel-default">
          <TelecastListSimplest telecastData={getData('TelecastList-APL')} columnList={["p25_54", "m25_54", "w25_54"]} isFetching={totalFetching(['TelecastList-APL'])} />
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
  const {nets, selectedNetwork, selectedWeek, weeks, ratings, dates } = state

  return {
    selectedNetwork,
    selectedWeek,
    nets,
    ratings,
    dates,
    //isFetching,
    weeks
  }
}

export default connect(mapStateToProps)(App)
