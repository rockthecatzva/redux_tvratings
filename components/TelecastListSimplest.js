import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Reactable from 'reactable'

var Table = Reactable.Table;
var Thead = Reactable.Thead;
var Th = Reactable.Th;

var Loader = require('halogen/PulseLoader');

/*
"ratings":{
"lsd":{"aa":{"p25_54":"0.08","m25_54":"0.07"}},
"l3d":{"aa":{"m25_54":"0.07","p25_54":"0.09"}}
}
}
*/

export default class TelecastRankerBox extends Component {

  componentWillReceiveProps(nextprop){
  }

  componentDidMount(){
  }

  render() {
    const { telecastData, columnList, isFetching } = this.props

    return (
      <div className={"telecast-box panel-body"}>
      {isFetching &&
        <div className="spinner">
        <Loader color="#26A65B" size="16px" margin="4px"/>
        <span className="sr-only">Loading...</span>
        </div>
      }

      <Table sortable={true} className="table" data={telecastData} sortable={false} defaultSort={{column: 'aa-l3d-p25_54', direction: 'desc'}} >
      <Thead>


      <Th column="concat_name">
      Program Name
      </Th>


      <Th column="dow">
      Day
      </Th>

      <Th column="aa-l3d-p25_54">
      P25-54
      </Th>
      <Th column="aa-l3d-m25_54">
      M25-54
      </Th>
      <Th column="aa-l3d-w25_54">
      W25-54
      </Th>


      </Thead>
      </Table>



      </div>
    )
  }
}

TelecastRankerBox.propTypes = {
  telecastData: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  columnList: PropTypes.array.isRequired
}
