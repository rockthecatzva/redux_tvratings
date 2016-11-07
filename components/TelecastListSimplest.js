import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Reactable from 'reactable'

var Table = Reactable.Table;
var Thead = Reactable.Thead;
var Th = Reactable.Th;
var Tr = Reactable.Tr;
var Td = Reactable.Td;

var Loader = require('halogen/PulseLoader');


export default class TelecastListSimplest extends Component {

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

      <Table sortable={true} sortable={false} defaultSort={{column: 'aa-l3d-p25_54', direction: 'desc'}} >


      <Thead>



        <Th className="table-header text-left" column="concat_name">
        Program Name
        </Th>


        <Th className="table-header" column="dow">
        Day
        </Th>

        <Th className="table-header" column="aa-l3d-p25_54">
        P25-54
        </Th>
        <Th className="table-header" column="aa-l3d-m25_54">
        M25-54
        </Th>
        <Th className="table-header" column="aa-l3d-w25_54">
        W25-54
        </Th>


      </Thead>





          {telecastData.map(function(row, i){
            return(
              <Tr key={i}>
                <Td column="concat_name">{row["concat_name"]}</Td>
                <Td column="dow" className="text-center">{row["dow"]}</Td>
                <Td column="aa-l3d-p25_54" className="text-center">{row["aa-l3d-p25_54"]}</Td>
                <Td column="aa-l3d-m25_54" className="text-center">{row["aa-l3d-m25_54"]}</Td>
                <Td column="aa-l3d-w25_54" className="text-center">{row["aa-l3d-w25_54"]}</Td>
              </Tr>
              )
            })
          }

      









      </Table>



      </div>
    )
  }
}

TelecastListSimplest.propTypes = {
  telecastData: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  columnList: PropTypes.array.isRequired
}
