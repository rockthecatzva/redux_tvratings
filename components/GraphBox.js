import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
var Loader = require('halogen/PulseLoader');

var d3 = require('d3')

const MARGIN =  30
//IS THIS STATE???
var width, height = 0

export default class GraphBox extends Component {

  updateData(data){
    
    var el = d3.select(ReactDOM.findDOMNode(this)).select("svg")
    var x = d3.scaleLinear().domain([0, data.graphData[0].length-1]).range([MARGIN, width-MARGIN])
    var max = 0

    //console.log("did this fix", data.graphData)

    {data.graphData.map(function(arr){
      //console.log(arr, "is the error here?")
      if(arr){
        arr.map(function(rating){
          if(rating.rating>max){
            max = rating.rating;
            }
          })
        }
    })}

    var y = d3.scaleLinear().domain([0, max]).range([height-MARGIN, MARGIN]);

    var line = d3.line()
    .x(function(d, i) { 
      return x(i)
    })
    .y(function(d) { 
      return y(d.rating)
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
                return y(d.rating); })
              .style("fill", "white")
              .style("stroke", "black")
              .style("stroke-width", "2");

        d.exit().remove();
      })}
    }



    componentWillReceiveProps(nextprop){
      console.log("getting data", nextprop)

      //this will only handle 2 lines, not 1 and not 2+ but 2 - need to rethink this
      if((nextprop.graphData !== this.props.graphData)&&(nextprop.graphData[0][0]&&nextprop.graphData[1][0])){
        this.updateData(nextprop)

        //THE ISSUE IS THAT GRAPH AND TABLES ARE RECIEVING THE SAME DATA AGAIN 
        //NEED TO MAKE THEM IGNORE IT UNLESS THE SUBMIT BUTTON HAS BEEN PRESSED
        //IM STILL NOT SURE WHY ITS GETTING FIRED SIMPLY BY CHANIGN NET OR WEEK
        console.log("ITS DIFFERENT DATA TOO!!", nextprop.graphData, this.props.graphData, (nextprop.graphData==this.props.graphData))
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
      const { graphData, isFetching } = this.props
      
      //console.log("Rendering the graph", spin, this.spin, this.props.showSpinner)

      return (
        <div className={"graph-box panel-body"}>
        {isFetching &&
          <div className="spinner">
            <Loader color="#26A65B" size="16px" margin="4px"/>
            <span className="sr-only">Loading...</span>
          </div>
        }
        </div>
        )
    }
  }

  GraphBox.propTypes = {
    graphData: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired
  }
