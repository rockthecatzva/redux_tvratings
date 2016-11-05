import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Reactable from 'reactable'

var Table = Reactable.Table;
var Thead = Reactable.Thead;
var Th = Reactable.Th;

var Loader = require('halogen/PulseLoader');


export default class CableRankerList extends Component {

  componentWillReceiveProps(nextprop){
  }

  componentDidMount(){
  }

  render() {
    const { telecastData, isFetching } = this.props

    return (
      <div>
        {isFetching &&
          <div className="spinner">
          <Loader color="#26A65B" size="16px" margin="4px"/>
          <span className="sr-only">Loading...</span>
          </div>
        }

        <Table sortable={[
    {
        column: 'curr_rating',
        sortFunction: function(a, b){
            console.log(parseInt(a), parseInt(b));
            return (parseInt(a)<parseInt(b));
        }
    },

]} data={telecastData} >
          <Thead>
            <Th column="curr_rank">
            Rank
            </Th>
            <Th column="yago_rank">
            YAGO-Rank
            </Th>
            <Th column="net">
            Network
            </Th>

            <Th column="cur_rating" >
            Current Rating
            </Th>
          </Thead>
        </Table>
      </div>
    )
  }
}

CableRankerList.propTypes = {
  telecastData: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired
  //columnList: PropTypes.array.isRequired
}
