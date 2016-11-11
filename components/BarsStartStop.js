import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
var Loader = require('halogen/PulseLoader');
var d3 = require('d3')

const MARGIN = 40
//IS THIS STATE???
var width, height = 0

export default class BarsStartStop extends Component {

    updateData(data) {

      var barw = 30;



      var el = d3.select(ReactDOM.findDOMNode(this)).select("svg");
      el.selectAll(".maingroup").remove()
      el = el.append("g")
        .attr("class", "maingroup")
        .attr("transform", "translate(" + MARGIN + ","+MARGIN+")");

      //var margin = {top: 30, right: 30, bottom: 45, left: 40},
			//padding = 0.1

      //width = width - margin.left - margin.right
			//height = height - margin.top - margin.bottom

			var x = d3.scaleBand()
			.range([0, (width-MARGIN)]);

			var y = d3.scaleLinear()
			.range([height-(MARGIN*2), 0]);

			var xAxis = d3.axisBottom(x);

			var yAxis = d3.axisLeft(y);
			//.tickFormat(function(d) { return (d); });

      /*
			var chart = el.append("g").select(".chart")
      .attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
*/
			var max = 0;


			{
					data.map(function (arr) {
						if (parseInt(arr.cur_rating) > max) {
								max = parseInt(arr.cur_rating);
						}

						if (parseInt(arr.yago_rating) > max) {
							max = parseInt(arr.yago_rating);
						}
					})
			}


			x.domain(data.map(function(d) { return d.net; }));
			y.domain([0, max]);

      el.selectAll(".xaxis").remove()
			el.append("g")
			.attr("class", "xaxis")
      .attr("transform", "translate(0," + (height-MARGIN*2) + ")")
			.call(xAxis);

      el.selectAll(".yaxis").remove()
			el.append("g")
			.attr("class", "yaxis")
      //.attr("transform", "translate(" + MARGIN + ","+MARGIN+")")
			.call(yAxis);

			el.select(".xaxis").selectAll("text").remove();
			var ticks = el.select(".xaxis").selectAll(".tick")
                    .data(data)
                    .append("svg:image")
                    .attr("xlink:href", function (d) { return "./img/"+d.net.trim()+"-logo.png" ; })
										//.attr("class", "graph-label")
										.attr("y", 2)
										.attr("x", -30)
                    .attr("width", 60)
                    .attr("height", 40);


      el.selectAll(".bar").remove()
			var bar = el.selectAll(".bar")
			.data(data)
			.enter().append("g")
			.attr("transform", function(d) { return "translate(" + (x(d.net)+x.bandwidth()/2-(barw/2)) + ",0)"; })
      .attr("class", "bar");

			bar.append("rect")
			.attr("y", function(d) { return y( Math.max(d.cur_rating, d.yago_rating) ); })
			.attr("height", function(d) { return Math.abs( y(d.cur_rating) - y(d.yago_rating) ); })
			.attr("width", barw)//x.bandwidth()
			//.attr("x", function(d){ return (x)})
			.attr("class", function(d){
				if(parseFloat(d.cur_rating)>parseFloat(d.yago_rating)){
					return "gainer";
				}
				else{
					return "decliner";
				}
			});


			/*
			bar.append("circle")
			.attr("cx", (x.rangeBand()/2))
			.attr("cy", function(d) { return y(d.cur_rating) + 2; })
			.attr("r", 15)
			.attr("class", "bg-circ");
			*/

			bar.append("text")
			.attr("x", Math.floor(barw/2))//Math.floor(x.bandwidth()/2)
			.attr("y", function(d) {
        let label_padding = 4;
        let fontheight = 9;
        if(parseFloat(d.cur_rating)>parseFloat(d.yago_rating)){
          return y(d.cur_rating)-label_padding;
        }
        else{
          return y(d.cur_rating)+label_padding+fontheight;
        }


        })
			.attr("class", "graph-label")
			.text(function(d) { return Math.round(d.cur_rating);});


    }


    componentWillReceiveProps(nextprop) {
        console.log("bardata - getting data", nextprop)

        if ((nextprop.barData !== this.props.barData)&&(nextprop.barData.length)) {
            this.updateData(nextprop.barData)
        }
    }


    componentDidMount() {
        var el = ReactDOM.findDOMNode(this);
        width = el.offsetWidth - MARGIN
        height = el.offsetHeight - MARGIN

        var formatDate = d3.timeFormat("%d-%b-%y")
        var svg = d3.select(el).append("svg")
            .attr("width", width)
            .attr("height", height)
    }


    render() {
        const {barData, isFetching} = this.props

        console.log("Rendering the graph", barData, isFetching)

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

BarsStartStop.propTypes = {
    barData: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired
}
