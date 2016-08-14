import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Reactable from 'reactable'

var Table = Reactable.Table;
var Thead = Reactable.Thead;
var Th = Reactable.Th;

var Loader = require('halogen/PulseLoader');

var finaldata = []

var dow = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default class TelecastRankerBox extends Component {

  componentWillReceiveProps(nextprop){

  }




  componentDidMount(){
      /*var el = ReactDOM.findDOMNode(this);
      width = el.offsetWidth
      height = el.offsetHeight
  
      var formatDate = d3.timeFormat("%d-%b-%y")
      var svg = d3.select(el).append("svg")
      .attr("width", width)
      .attr("height", height)
      */
    }


    render() {
      const { telecastData, isFetching } = this.props
      var finallist = []
      var colList = []

      if(telecastData.length-1){

        //console.log("Rendering the TELECAST LIST", telecastData.length)
        var tempOb = {}
        var found = false
        var label = ""


        

        var addToColumnList = function(lbl){
          console.log("INSIDE addToColumnList")
          var found=false
          for(var label of colList){
            if(lbl == label){
              found=true
              break
            }
          }
          if(!found){
            colList.push(lbl)
          }

        }

        for(var newdat of telecastData){
          found=false
          for(var saveddat of finallist){
            if(saveddat['date_time']==newdat['date_time']){
              found = true
              label = newdat['data_label']
              addToColumnList(label)
              tempOb = {
                [label]: newdat['rating_val']
              }
              //console.log('Found a matching object!!', saveddat['date_time'], newdat['date_time'], label, tempOb)
              saveddat = Object.assign(saveddat, tempOb)
              break
            }
          }

          if(!found){
            newdat[newdat['data_label']] = newdat['rating_val']
            addToColumnList(newdat['data_label'])
            //console.log("I didnt find a matching object, saving a new one to the final list", newdat)
            delete newdat['data_label']
            delete newdat['data_stream']
            delete newdat['rating_val']
            delete newdat['rating_type']
            delete newdat['demo']
          //convert date_time to two date AND time columns??
          var d = new Date(newdat['date_time'])
          newdat['dow'] = dow[d.getDay()]
          newdat['date'] = d.getMonth()+1+"/"+d.getDate()+"/"+Math.round(((d.getFullYear()/1000)%1)*1000)

          var hours = d.getHours();
          var minutes = d.getMinutes();
          var ampm = hours >= 12 ? 'p' : 'a';
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          minutes = minutes < 10 ? '0'+minutes : minutes;
          var strTime = hours + ':' + minutes + '' + ampm;
          newdat['time'] = strTime
          //delete newdat['date_time']

          finallist.push(newdat)
        }  
      }
    }



console.log("FINAL RENDER LIST", finallist)


        return (
          <div className={"telecast-box panel-body"}>
          {isFetching &&
            <div className="spinner">
            <Loader color="#26A65B" size="16px" margin="4px"/>
            <span className="sr-only">Loading...</span>
            </div>
          }

          <Table sortable={true} className="table" data={finallist} itemsPerPage={10} currentPage={0} >
            <Thead>
              <Th column="date">
              Date
              </Th>

              <Th column="clean_name">
              Program Name
              </Th>

              <Th column="telecast_episode">
              Episode Name
              </Th>

              <Th column="telecast_code">
              Premiere/Repeat
              </Th>

              <Th column="dow">
              Day
              </Th>

              <Th column="time">
              Time
              </Th>
              <Th column="duration">
              Duration
              </Th>

              {colList.map(function(col, i){
                return(
                  <Th key={i} column={col}>
                    {col}
                  </Th>)
              })}

            </Thead>
          </Table>



          </div>
          )
}
}

TelecastRankerBox.propTypes = {
  telecastData: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired
}
