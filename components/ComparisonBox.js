import React, { Component, PropTypes } from 'react'
var Loader = require('halogen/PulseLoader');

export default class ComparisonBox extends Component {

constructor(props) {
    super(props);
    this.state = {
      value1: 0,
      value2: 0,
      label1: 0,
      round: false
    }
  }




  render() {

    const { value1, value2, label1, round, isFetching} = this.props
    var diff


    if(value1 && value2){
      diff = Math.round(((value1 - value2)/value2)*100) || "n/a"
      //console.log("COMPARISON BOX", diff, value1, value2)
      var colorclass = ""
      var arrow = "glyphicon glyphicon-circle-arrow-"
      if(diff>0){
            arrow = arrow + "up";
            colorclass = "green"
          }
          else{
            arrow = arrow + "down";
            colorclass = "red";
          }  
    }
    

    //console.log("COMPARISON BOX", value1, value2, diff)

    return (<div className="info-box col-sm-2 panel panel-default">
              <div>
              {isFetching &&
                <div className="spinner">
                  <Loader color="#26A65B" size="16px" margin="4px"/>
                  <span className="sr-only">Loading...</span>
                </div>
              }
                <div className="infobox-primaryval">{value1}</div>
                  <span className={colorclass+" infobox-changeval"}>
                  <span className={arrow} aria-hidden="true"></span> {diff}%</span> 
                <div className="infobox-label"> {label1}</div>
              </div>
            </div>
    )
  }
}

ComparisonBox.propTypes = {
  value1: PropTypes.number.isRequired,
  value2: PropTypes.number.isRequired,
  label1: PropTypes.string.isRequired,
  round: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired
}
