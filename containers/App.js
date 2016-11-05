import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchAPIData, fetchDates} from '../actions'
import Picker from '../components/Picker'
import ComparisonBox from '../components/ComparisonBox'
import GraphBox from '../components/GraphBox'
import BarsStartStop from '../components/BarsStartStop'
import TelecastListSimplest from '../components/TelecastListSimplest'
import CableRankerList from '../components/CableRankerList'

//const tmpUrl =
const finalUrl  = "http://dctrydatrk01.discovery.com/api/"
//const tempUrl= "http://localhost:8888/api-tvratings-phpslim/"


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
    dispatch(fetchDates("Week", "getCurrentWeek"))
  }

  componentWillReceiveProps(nextProps) {
    //console.log("Got new props", nextProps)
    const { dispatch } = this.props// IS THIS KOSHER???

    if(nextProps.dates !== this.props.dates){
      console.log("FOUND NEW DATES", nextProps)
      if(nextProps.dates.hasOwnProperty('Qtd')){
        if(nextProps.dates.Qtd!=this.props.dates.Qtd){
          console.log("QTD is now in !! ?")
          dispatch(fetchAPIData(finalUrl+'time.php/getDaypartAverage?nets%5B%5D=APL&nets%5B%5D=DISC&nets%5B%5D=ID&nets%5B%5D=TLC&nets%5B%5D=DAM&nets%5B%5D=AHC&nets%5B%5D=VEL&nets%5B%5D=SCI&nets%5B%5D=OWN&nets%5B%5D=DLIF&nets%5B%5D=DFC&stream=l3d&demo=p25_54&metric=imp&starttime='+nextProps.dates.Qtd.start+'&daysin='+nextProps.dates.Qtd.daysin+'&yagostart='+nextProps.dates.Qtd.yagostart, 'QTDPortfolioBarChart-DCI'))
          dispatch(fetchAPIData(finalUrl+'time.php/getCableRanks?stream=l3d&demo=p25_54&metric=imp&start='+nextProps.dates.Qtd.start+'&daysin='+nextProps.dates.Qtd.daysin+'&yagostart='+nextProps.dates.Qtd.yagostart, 'ASCO-Ranks-QTD-P2554'))
          dispatch(fetchAPIData(finalUrl+'time.php/getCableRanks?stream=l3d&demo=m25_54&metric=imp&start='+nextProps.dates.Qtd.start+'&daysin='+nextProps.dates.Qtd.daysin+'&yagostart='+nextProps.dates.Qtd.yagostart, 'ASCO-Ranks-QTD-M2554'))
          dispatch(fetchAPIData(finalUrl+'time.php/getCableRanks?stream=l3d&demo=w25_54&metric=imp&start='+nextProps.dates.Qtd.start+'&daysin='+nextProps.dates.Qtd.daysin+'&yagostart='+nextProps.dates.Qtd.yagostart, 'ASCO-Ranks-QTD-W2554'))
        }
      }

      if(nextProps.dates.hasOwnProperty('Ytd')){
        console.log("YTD is now in !! ?")
        if(nextProps.dates.Ytd!=this.props.dates.Ytd){
          dispatch(fetchAPIData(finalUrl+'time.php/getWeeklyDaypartAverages/?net=APL&metric=aa&stream=l3d&demo=p25_54&starttime='+nextProps.dates.Ytd.start+'&daysin='+nextProps.dates.Ytd.daysin, 'Weekly-APL-YTD-P2554-L3D'))
          dispatch(fetchAPIData(finalUrl+'time.php/getWeeklyDaypartAverages/?net=APL&metric=aa&stream=l3d&demo=p25_54&starttime='+nextProps.dates.Ytd.yagostart+'&daysin='+nextProps.dates.Ytd.yagofulldays, 'Weekly-APL-YAGOYTD-P2554-L3D'))

          dispatch(fetchAPIData(finalUrl+'time.php/getWeeklyDaypartAverages/?net=DISC&metric=aa&stream=l3d&demo=p25_54&&starttime='+nextProps.dates.Ytd.start+'&daysin='+nextProps.dates.Ytd.daysin, 'Weekly-DISC-YTD-P2554-L3D'))
          dispatch(fetchAPIData(finalUrl+'time.php/getWeeklyDaypartAverages/?net=DISC&metric=aa&stream=l3d&demo=p25_54&&starttime='+nextProps.dates.Ytd.yagostart+'&daysin='+nextProps.dates.Ytd.yagofulldays, 'Weekly-DISC-YAGOYTD-P2554-L3D'))
        }

      }


      if(nextProps.dates.hasOwnProperty('Week')){
        console.log("WEEK is now in !! ?")
        if(nextProps.dates.Week!=this.props.dates.Week){
          dispatch(fetchAPIData(finalUrl+'telecasts.php/getweeklylistbydemo/?net=APL&metric=aa&stream=l3d&demos%5B%5D=p25_54&demos%5B%5D=m25_54&demos%5B%5D=w25_54&starttime='+nextProps.dates.Week.start+'&days=7&limitby=10', 'TelecastList-APL'))
          dispatch(fetchAPIData(finalUrl+'telecasts.php/getweeklylistbydemo/?net=DISC&metric=aa&stream=l3d&demos%5B%5D=p25_54&demos%5B%5D=m25_54&demos%5B%5D=w25_54&starttime='+nextProps.dates.Week.start+'&days=7&limitby=10', 'TelecastList-DISC'))
        }
      }



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
      var isFetching = false;

      for (var set in nameset) {
        //console.log(set, ratings[nameset[set]], nameset, nameset[set], ratings[nameset[set]])
        if(!ratings[nameset[set]]){
          isFetching = true
          break
        }
      }

      return isFetching;
    }

    var wkdate = new Date(dates.Week.start)
    var wkdatestr = (wkdate.getMonth()+1)+"/"+(wkdate.getDate())+"/"+(wkdate.getFullYear())

    return (
      <div>
      <div className="col-sm-10 col-sm-offset-1">
        <div className="box-title">QTD DCI PORTFOLIO VS. SAME WKS. YAGO</div>
        <BarsStartStop barData={getData('QTDPortfolioBarChart-DCI')} isFetching={totalFetching(['QTDPortfolioBarChart-DCI'])} />
      </div>


      <br/>
      <div className="row">
        <div className="col-sm-8 col-sm-offset-2">
          <div className="box-title">DISC PRIME WEEKLY RATINGS (L3) VS. YAGO</div>
          <GraphBox height={300} width={500} graphData={[getData('Weekly-DISC-YTD-P2554-L3D'), getData('Weekly-DISC-YAGOYTD-P2554-L3D')]} lineTags={["DISC","DISC-yago"]} isFetching={totalFetching(["Weekly-DISC-YTD-P2554-L3D", "Weekly-DISC-YAGOYTD-P2554-L3D"])} />
        </div>

        <div className="col-sm-8  col-sm-offset-2">
          <div className="box-title">APL PRIME WEEKLY RATINGS (L3) VS. YAGO</div>
          <GraphBox height={300} width={500} graphData={[getData('Weekly-APL-YTD-P2554-L3D'), getData('Weekly-APL-YAGOYTD-P2554-L3D')]} lineTags={["APL","APL-yago"]} isFetching={totalFetching(["Weekly-APL-YTD-P2554-L3D", "Weekly-APL-YAGOYTD-P2554-L3D"])} />
        </div>
      </div>

      <br/>

      <div className="row">
        <div className="col-sm-6">
          <div className="box-title">APL TOP TELECASTS: WK OF {wkdatestr} (L3)</div>
          <TelecastListSimplest telecastData={getData('TelecastList-APL')} columnList={["p25_54", "m25_54", "w25_54"]} isFetching={totalFetching(['TelecastList-APL'])} />
        </div>

        <div className="col-sm-6">
          <div className="box-title">DISC TOP TELECASTS: WK OF {wkdatestr} (L3)</div>
          <TelecastListSimplest telecastData={getData('TelecastList-DISC')} columnList={["p25_54", "m25_54", "w25_54"]} isFetching={totalFetching(['TelecastList-DISC'])} />
        </div>
      </div>

      <br/>
      <br/>

    <div className="row">
      <div className="col-sm-4">
        <div className="box-title">QTD ASCO PRIME L3 RANKER - P25-54</div>
        <CableRankerList telecastData={getData('ASCO-Ranks-QTD-P2554')} colName={"P25-54 000"} isFetching={totalFetching(['ASCO-Ranks-QTD-P2554'])} />
      </div>
      <div className="col-sm-4">
        <div className="box-title">QTD ASCO PRIME L3 RANKER - M25-54</div>
        <CableRankerList telecastData={getData('ASCO-Ranks-QTD-M2554')} colName={"M25-54 000"} isFetching={totalFetching(['ASCO-Ranks-QTD-M2554'])} />
      </div>
      <div className="col-sm-4">
        <div className="box-title">QTD ASCO PRIME L3 RANKER - W25-54</div>
        <CableRankerList telecastData={getData('ASCO-Ranks-QTD-W2554')} colName={"W25-54 000"} isFetching={totalFetching(['ASCO-Ranks-QTD-W2554'])} />
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
