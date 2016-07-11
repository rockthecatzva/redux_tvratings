import React, { Component, PropTypes } from 'react'

export default class ComparisonBox extends Component {
  render() {
    const { value1=0, value2=0, label1="" } = this.props
    const diff = Math.round(((value1 - value2)/value2)*100) || "n/a"
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

    return (
      <div className="info-box col-sm-2 panel panel-default">
        <div className="infobox-primaryval">{value1}</div>
        <span className={colorclass+" infobox-changeval"}>
        <span className={arrow} aria-hidden="true"></span> {diff}%</span> 
        <div className="infobox-label"> {label1}</div>
        
        
      </div>
    )
  }
}

ComparisonBox.propTypes = {
  value1: PropTypes.number.isRequired,
  value2: PropTypes.number.isRequired,
  label1: PropTypes.string.isRequired
}
