import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
var Loader = require('halogen/PulseLoader');


export default class CableRankerList extends Component {
  render() {
    const { telecastData, isFetching, colName } = this.props

    return (
      <div>
        {isFetching &&
          <div className="spinner">
          <Loader color="#26A65B" size="16px" margin="4px"/>
          <span className="sr-only">Loading...</span>
          </div>
        }

        <table className="fadetext">
          <thead>
            <tr>
              <th className="text-right small-col table-header">Rank</th>
              <th className="text-center small-col table-header">&#916;</th>
              <th className="text-left med-col table-header">Network</th>
              <th className="text-right lrg-col table-header">{colName}</th>
            </tr>
          </thead>


        {telecastData &&
          <tbody>
            {telecastData.map(function(row, i){
              var chg = row.yago_rank-row.curr_rank
              //console.log("Are null?", row.yago_rank, row.curr_rank)
              var cl = (chg>0?"green":"red")
              if((chg==0)||(row.yago_rank==null||row.curr_rank==null)){
                cl=""
                chg = "-"
              }

              return (
                <tr key={i}>
                  <td className="text-right rank lowtrans">{row.curr_rank}</td>
                  <td className={"rank-change "+cl} >{chg}</td>
                  <td className={"text-left "+(row.net.trim())+"-txtlabel lowtrans"}>{row.net}</td>
                  <td className={"text-right lowtrans "+(row.net.trim())+"-txtlabel"}>{row.curr_rating}</td>
                </tr>
              )
            })}
            </tbody>
        }

        </table>
      </div>
    )
  }
}

CableRankerList.propTypes = {
  telecastData: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  colName: PropTypes.string.isRequired
  //columnList: PropTypes.array.isRequired
}
