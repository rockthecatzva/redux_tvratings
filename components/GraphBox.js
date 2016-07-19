import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
var d3 = require('d3')

const MARGIN =  30
var width, height = 0

export default class GraphBox extends Component {

  updateData(data){
    var el = d3.select(ReactDOM.findDOMNode(this)).select("svg")
    //var width = parseInt(d3.select(d3.select(ReactDOM.findDOMNode(this))).style("width")) - MARGIN*2,
        //height = parseInt(d3.select(d3.select(ReactDOM.findDOMNode(this))).style("height")) - MARGIN*2;
    console.log("<<<<<<>>>>>>", this, d3.select(el))

    var x = d3.scaleLinear().domain([0, data.graphData[0].length-1]).range([MARGIN, width-MARGIN]);

    var max = 0

    {data.graphData.map(function(arr){

      arr.map(function(rating){
        if(rating.rating_avg>max){
          max = rating.rating_avg;
        }
      })
    })}

    //console.log("max is ", max, data.graphData)
    var y = d3.scaleLinear().domain([0, max]).range([height-MARGIN, MARGIN]);

    var line = d3.line()
    .x(function(d, i) { 
      return x(i)
    })
    .y(function(d) { 
      return y(d.rating_avg)
    });

    

    var xAxis = d3.axisBottom(x);
    var xlabels = data.graphData[0].map(function(d){
      var t = new Date(d.date_time)
      var s = t.getMonth()+1+"/"+t.getDate()+"/"+t.getFullYear().toString().substr(2,2);
      return s
    })

    xAxis.ticks(data.graphData[0].length)
    xAxis.tickFormat(function(d,i){
      return xlabels[i];
    })
      // Add the x-axis.
      el.selectAll(".xaxis").remove()
      el.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0,"+(this.props.height-MARGIN)+")")
      .call(xAxis);

      //add the y axis
      var yAxisLeft = d3.axisLeft(y);
      el.selectAll(".yaxis").remove()
      el.append("g")
      .attr("class", "yaxis")
      .attr("transform", "translate("+MARGIN+",0)")
      .call(yAxisLeft);

      el.selectAll(".graph-line").remove()
      el.selectAll(".dot").remove()

      {data.graphData.map(function(arr){

        var d= el.append("g").selectAll("circle").data(arr);      
        d.enter().append("circle")
        //.attr("transform", "translate("+MARGIN+",-"+MARGIN+")")
        .attr("class", "dot")
        .attr("r", 3.5)
              .merge(d)//ENTER AND UPDATE
              .attr("cx", function(d, i) { 
                console.log("calcling circle")
                return x(i); })
              .attr("cy", function(d) { 
                return y(d.rating_avg); });

              d.exit().remove();

              var graph = el.append("g").data([arr]);
              graph.append("path")
              .attr("class", "graph-line")
              .attr("d", line)
              //.attr("transform", "translate("+MARGIN+",-"+MARGIN+")")
            })}      
    }

    componentWillReceiveProps(nextprop){
      if((nextprop.graphData !== this.props.graphData)&&(nextprop.graphData[0])){
        
        this.updateData(nextprop);
      }
    }





    componentDidMount(){
      var el = ReactDOM.findDOMNode(this)
      var formatDate = d3.timeFormat("%d-%b-%y")
      var svg = d3.select(el).append("svg")
      .attr("width", this.props.width)
      .attr("height", this.props.height)

       var el = ReactDOM.findDOMNode(this);
      
      width = el.offsetWidth
      height = el.offsetHeight
      console.log("HEIGHT TeSt -->> ", width, height)
    }


    render() {
      const { graphData } = this.props
      console.log("check here")

      return (
        <div className={"graph-box panel-body"}></div>
        )
    }
  }

  GraphBox.propTypes = {
    graphData: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }
