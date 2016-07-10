import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
var d3 = require('d3')

export default class GraphBox extends Component {

  updateData(data){
    var x = d3.scaleLinear().domain([0, data.set1.length-1]).range([0, this.props.width]);
    var y = d3.scaleLinear().domain([0, d3.max(data.set1, function(d) { return d.rating_avg; })]).range([this.props.height, 0]);

    var line = d3.line()
    .x(function(d, i) { 
      return x(i)
    })
    .y(function(d) { 
      return y(d.rating_avg)
    });

    var el = d3.select(ReactDOM.findDOMNode(this)).select("svg")

    var xAxis = d3.axisBottom(x);
        var xlabels = data.set1.map(function(d){
          var t = new Date(d.date_time)
          var s = t.getMonth()+1+"/"+t.getDate()+"/"+t.getFullYear().toString().substr(2,2);
          return s
        })

        xAxis.ticks(data.set1.length)
        xAxis.tickFormat(function(d,i){
          return xlabels[i];
        })

      // Add the x-axis.
      el.selectAll(".xaxis").remove()
      el.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(30,"+(this.props.height-20)+")")
      .call(xAxis);

      //add the y axis
      var yAxisLeft = d3.axisLeft(y);
      el.selectAll(".yaxis").remove()
      el.append("g")
      .attr("class", "yaxis")
      .attr("transform", "translate(30,20)")
      .call(yAxisLeft);

      var d= el.selectAll("circle").data(data.set1);      

      d.enter().append("circle")
      .attr("transform", "translate(30,20)")
      .attr("r", 3.5)
      .merge(d)//ENTER AND UPDATE
      .attr("cx", function(d, i) { 
        return x(i); })
      .attr("cy", function(d) { 
        return y(d.rating_avg); });

      d.exit().remove();


      el.selectAll(".graph-line").remove()
      var graph = el.append("g").data([data.set1]);
      console.log("here is graph so far", graph)
      graph.append("path")
      .attr("class", "graph-line")
      .attr("d", line)
      .attr("transform", "translate(30,20)");
    }

    componentWillReceiveProps(nextprop){
      if(nextprop.set1 !== this.props.set1){
        this.updateData(nextprop);
      }

    }


    componentDidMount(){
      var el = ReactDOM.findDOMNode(this)
      var formatDate = d3.timeFormat("%d-%b-%y")
      var svg = d3.select(el).append("svg")
      .attr("width", this.props.width)
      .attr("height", this.props.height)
    }



    render() {
      const { set1, set2 } = this.props

      return (
        <div className={"graph-box panel-body"}></div>
        )
    }
  }

  GraphBox.propTypes = {
    set1: PropTypes.array.isRequired,
    set2: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }
