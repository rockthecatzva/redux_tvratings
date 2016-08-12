import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
var Loader = require('halogen/PulseLoader');

var spin = true

export default class TelecastRankerBox extends Component {
    toggleSpinner(showspin){
      if(showspin){
        spin = true// THIS MAKES IT STATE???????
        console.log("Showing the spinner on the graph")
      }
    }

    componentWillReceiveProps(nextprop){
      if(nextprop.showSpinner!== this.props.showSpinner){
        this.toggleSpinner(nextprop.showSpinner)
      }

      
      if((nextprop.telecastData !== this.props.telecastData)&&(nextprop.telecastData[0])){
        //this.updateData(nextprop)
        spin = false
         console.log("WE GOT TELECAST DATA!!!!", nextprop.telecastData)
      }

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
      const { telecastData, showSpinner } = this.props
      
      //console.log("Rendering the graph", spin, this.spin, this.props.showSpinner)

      return (
        <div className={"telecast-box panel-body"}>
        {spin &&
          <div className="spinner">
            <Loader color="#26A65B" size="16px" margin="4px"/>
            <span className="sr-only">Loading...</span>
          </div>
        }
        </div>
        )
    }
  }

  TelecastRankerBox.propTypes = {
    telecastData: PropTypes.array.isRequired,
    showSpinner: PropTypes.bool.isRequired
  }
