import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchAPIData, fetchDates} from '../actions'
import Picker from '../components/Picker'
import ComparisonBox from '../components/ComparisonBox'
import GraphBox from '../components/GraphBox'
import BarsStartStop from '../components/BarsStartStop'
import TelecastListSimplest from '../components/TelecastListSimplest'
import CableRankerList from '../components/CableRankerList'


class App extends Component {
  constructor(props) {
    super(props)
    //this.handleNetChange = this.handleNetChange.bind(this)
    //this.handleWeekChange = this.handleWeekChange.bind(this)
    //this.handleSubmitClick = this.handleSubmitClick.bind(this)

  }

  componentDidMount() {
    const { dispatch, dates } = this.props
    dispatch(fetchDates("Qtd", "getQTD"))
    dispatch(fetchDates("Ytd", "getYTD"))
  }

  componentWillReceiveProps(nextProps) {
    //console.log("Got new props", nextProps)
    const { dispatch } = this.props// IS THIS KOSHER???

    if(nextProps.dates !== this.props.dates){
      console.log("FOUND NEW DATES", nextProps)
      if(nextProps.dates.hasOwnProperty('Qtd')){
        if(nextProps.dates.Qtd!=this.props.dates.Qtd){
          console.log("QTD is now in !! ?")
          dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/time.php/getDaypartAverage?nets%5B%5D=APL&nets%5B%5D=DISC&nets%5B%5D=ID&nets%5B%5D=TLC&nets%5B%5D=DAM&nets%5B%5D=AHC&nets%5B%5D=VEL&nets%5B%5D=SCI&nets%5B%5D=OWN&nets%5B%5D=DLIF&nets%5B%5D=DFC&stream=l3d&demo=p25_54&metric=imp&starttime='+nextProps.dates.Qtd.start+'&daysin='+nextProps.dates.Qtd.daysin+'&yagostart='+nextProps.dates.Qtd.yagostart, 'QTDPortfolioBarChart-DCI'))
          dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/time.php/getCableRanks?stream=l3d&demo=p25_54&metric=imp&start='+nextProps.dates.Qtd.start+'&daysin='+nextProps.dates.Qtd.daysin+'&yagostart='+nextProps.dates.Qtd.yagostart, 'ASCO-Ranks-QTD-P2554'))
          dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/time.php/getCableRanks?stream=l3d&demo=m25_54&metric=imp&start='+nextProps.dates.Qtd.start+'&daysin='+nextProps.dates.Qtd.daysin+'&yagostart='+nextProps.dates.Qtd.yagostart, 'ASCO-Ranks-QTD-M2554'))
          dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/time.php/getCableRanks?stream=l3d&demo=w25_54&metric=imp&start='+nextProps.dates.Qtd.start+'&daysin='+nextProps.dates.Qtd.daysin+'&yagostart='+nextProps.dates.Qtd.yagostart, 'ASCO-Ranks-QTD-W2554'))
        }
      }

      if(nextProps.dates.hasOwnProperty('Ytd')){
        console.log("YTD is now in !! ?")
        if(nextProps.dates.Ytd!=this.props.dates.Ytd){
          dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/time.php/getWeeklyDaypartAverages/?net=APL&metric=aa&stream=l3d&demo=p25_54&starttime='+nextProps.dates.Ytd.start+'&daysin='+nextProps.dates.Ytd.daysin, 'Weekly-APL-YTD-P2554-L3D'))
          dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/time.php/getWeeklyDaypartAverages/?net=APL&metric=aa&stream=l3d&demo=p25_54&starttime='+nextProps.dates.Ytd.yagostart+'&daysin='+nextProps.dates.Ytd.yagofulldays, 'Weekly-APL-YAGOYTD-P2554-L3D'))

          dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/time.php/getWeeklyDaypartAverages/?net=DISC&metric=aa&stream=l3d&demo=p25_54&&starttime='+nextProps.dates.Ytd.start+'&daysin='+nextProps.dates.Ytd.daysin, 'Weekly-DISC-YTD-P2554-L3D'))
          dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/time.php/getWeeklyDaypartAverages/?net=DISC&metric=aa&stream=l3d&demo=p25_54&&starttime='+nextProps.dates.Ytd.yagostart+'&daysin='+nextProps.dates.Ytd.yagofulldays, 'Weekly-DISC-YAGOYTD-P2554-L3D'))
        }

      }

      dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/telecasts.php/getweeklylistbydemo/?net=APL&metric=aa&stream=l3d&demos%5B%5D=p25_54&demos%5B%5D=m25_54&demos%5B%5D=w25_54&starttime=2015-10-19&days=7&limitby=10', 'TelecastList-APL'))
      dispatch(fetchAPIData('http://localhost:8888/api-tvratings-phpslim/telecasts.php/getweeklylistbydemo/?net=DISC&metric=aa&stream=l3d&demos%5B%5D=p25_54&demos%5B%5D=m25_54&demos%5B%5D=w25_54&starttime=2015-10-19&days=7&limitby=10', 'TelecastList-DISC'))




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
    const { nets, ratings, dates } = this.props

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
      <div className="col-sm-10">
        <div className="graph-title">QTD DCI Portfolio Performance vs. Same wks. YAGO</div>
        <BarsStartStop barData={getData('QTDPortfolioBarChart-DCI')} isFetching={totalFetching(["QTDPortfolioBarChart-DCI"])} />
      </div>
      <div className="row">
        <div className="col-sm-8">
          <div className="graph-title">DISC</div>
          <GraphBox height={300} width={500} graphData={[getData('Weekly-DISC-YTD-P2554-L3D'), getData('Weekly-DISC-YAGOYTD-P2554-L3D')]} lineTags={["DISC","DISC-yago"]} isFetching={totalFetching(["Weekly-DISC-YTD-P2554-L3D", "Weekly-DISC-YAGOYTD-P2554-L3D"])} />
        </div>

        <div className="col-sm-8">
          <div className="graph-title">APL</div>
          <GraphBox height={300} width={500} graphData={[getData('Weekly-APL-YTD-P2554-L3D'), getData('Weekly-APL-YAGOYTD-P2554-L3D')]} lineTags={["APL","APL-yago"]} isFetching={totalFetching(["Weekly-APL-YTD-P2554-L3D", "Weekly-APL-YAGOYTD-P2554-L3D"])} />
        </div>
      </div>


      <div className="row">
        <div className="col-sm-6">
          <TelecastListSimplest telecastData={getData('TelecastList-APL')} columnList={["p25_54", "m25_54", "w25_54"]} isFetching={totalFetching(['TelecastList-APL'])} />
        </div>

        <div className="col-sm-6">
          <TelecastListSimplest telecastData={getData('TelecastList-DISC')} columnList={["p25_54", "m25_54", "w25_54"]} isFetching={totalFetching(['TelecastList-DISC'])} />
        </div>
      </div>

    <div className="row">
      <div className="col-sm-4">
        <CableRankerList telecastData={getData('ASCO-Ranks-QTD-P2554')} isFetching={totalFetching(['ASCO-Ranks-QTD-P2554'])} />
      </div>
      <div className="col-sm-4">
        <CableRankerList telecastData={getData('ASCO-Ranks-QTD-M2554')} isFetching={totalFetching(['ASCO-Ranks-QTD-M2554'])} />
      </div>
      <div className="col-sm-4">
        <CableRankerList telecastData={getData('ASCO-Ranks-QTD-W2554')} isFetching={totalFetching(['ASCO-Ranks-QTD-W2554'])} />
      </div>
    </div>
</div>

    )
  }
}

App.propTypes = {
  //selectedNetwork: PropTypes.string.isRequired,
  //selectedWeek: PropTypes.string.isRequired,
  //weeks: PropTypes.object.isRequired,
  ratings: PropTypes.object.isRequired,
  dates: PropTypes.object.isRequired,
  //nets: PropTypes.object.isRequired,
  //isFetching: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const {ratings, dates } = state

  return {
    //selectedNetwork,
    //selectedWeek,
    //nets,
    ratings,
    dates,
    //isFetching,
    //weeks
  }
}

export default connect(mapStateToProps)(App)
