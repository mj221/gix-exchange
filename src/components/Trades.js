import React, { Component } from 'react';
import {connect} from 'react-redux'  // required to connect redux and app. Go to bottom page for config.

import {filledOrdersLoadedSelector, filledOrdersSelector} from '../store/selectors'

import Loader from './Loader'

const showFilledOrders = (filledOrders) =>{
  return(
    <tbody>
      { filledOrders.map((order) => {
        return(
          <tr style={{fontSize: '13px'}} className={`order-${order.id}`} key={order.id}>
            <td className= "text-muted">{order.formattedTimeStamp}</td>
            <td>{order.tokenAmount}</td>
            <td className={`text-${order.tokenPriceClass}`}>{order.tokenPrice}</td>
          </tr>
        )
      })}
    </tbody>)
}
class Trades extends Component {
  render(){
    return(
      <div className="card bg-dark text-white">

        <div className="card-header d-flex align-items-center" style={{justifyContent: 'space-between'}}>
          
          <span>Trades</span>
          {this.props.filledOrdersLoaded
            ?<span></span>
            :<Loader type="header"/>
          }
          
        </div>

        <div className="card-body">

          <table className="table table-dark table-sm small table-hover">
            <thead> 
              <tr>
                <th> Time</th>
                <th> POI </th>
                <th> POI/ETH </th>
              </tr>
            </thead>
              {this.props.filledOrders
                ? showFilledOrders(this.props.filledOrders)
                : <tbody></tbody>
              }

          </table>

        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    filledOrdersLoaded: filledOrdersLoadedSelector(state),
    filledOrders: filledOrdersSelector(state)
  }
}
export default connect(mapStateToProps)(Trades);
