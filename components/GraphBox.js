import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
var d3 = require('d3')

const MARGIN =  30
var width, height = 0
var spin = true

export default class GraphBox extends Component {

  updateData(data){
    var el = d3.select(ReactDOM.findDOMNode(this)).select("svg")
    var x = d3.scaleLinear().domain([0, data.graphData[0].length-1]).range([MARGIN, width-MARGIN])
    var max = 0

    {data.graphData.map(function(arr){
      arr.map(function(rating){
        if(rating.rating_avg>max){
          max = rating.rating_avg;
        }
      })
    })}

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
      .attr("transform", "translate(0,"+(height-MARGIN)+")")
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

      spin = false

      {data.graphData.map(function(arr){
        var graph = el.append("g").data([arr]);
        graph.append("path")
        .attr("class", "graph-line")
        .attr("d", line);
        //.attr("transform", "translate("+MARGIN+",-"+MARGIN+")")
        var d= el.append("g").selectAll("circle").data(arr);      
        d.enter().append("circle")
        //.attr("transform", "translate("+MARGIN+",-"+MARGIN+")")
        .attr("class", "dot")
        .attr("r", 3)
              .merge(d)//ENTER AND UPDATE
              .attr("cx", function(d, i) { 
                return x(i); })
              .attr("cy", function(d) { 
                return y(d.rating_avg); })
              .style("fill", "white")
              .style("stroke", "black")
              .style("stroke-width", "2");

        d.exit().remove();
      })}


    }


    toggleSpinner(showspin){
      if(showspin){

      }
      else{

      }
    }

    componentWillReceiveProps(nextprop){
      if(nextprop.showSpinner!== this.props.showSpinner){
        this.toggleSpinner(nextprop.showSpinner)
      }

      if((nextprop.graphData !== this.props.graphData)&&(nextprop.graphData[0])){
        this.updateData(nextprop);
      }
    }


    componentDidMount(){
      var el = ReactDOM.findDOMNode(this);
      width = el.offsetWidth
      height = el.offsetHeight
  
      var formatDate = d3.timeFormat("%d-%b-%y")
      var svg = d3.select(el).append("svg")
      .attr("width", width)
      .attr("height", height)
    }


    render() {
      const { graphData, showSpinner } = this.props
      console.log("g dat yo", graphData, graphData[0])

      return (
        <div className={"graph-box panel-body"}>
        {spin &&
          <div className="spinner">
            <i className="fa fa-refresh fa-spin fa-3x fa-fw"></i>
            <span className="sr-only">Loading...</span>
          </div>
        }
        </div>
        )
    }
  }

  GraphBox.propTypes = {
    graphData: PropTypes.array.isRequired,
    showSpinner: PropTypes.bool.isRequired
  }
