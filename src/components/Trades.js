import React, { Component } from 'react';
import {connect} from 'react-redux'  // required to connect redux and app. Go to bottom page for config.

import {filledOrdersLoadedSelector, filledOrdersSelector} from '../store/selectors'

import Spinner from './Spinner'

class Trades extends Component {


  render(){
    return(
      <div className="card bg-dark text-white">

        <div className="card-header d-flex align-items-center">
          
          <span>Trades</span>
          {this.props.filledOrdersLoaded
            ?<span></span>
            :<span class="spinner-border spinner-border-sm ml-auto" role="status" aria-hidden="true"></span>
          }
          
        </div>

        <div className="card-body">
          <table className="table table-dark table-sm small">
            <thead> 
              <tr>
                <th> Time </th>
                <th> POI </th>
                <th> POI/ETH </th>
              </tr>
            </thead>
              {this.props.filledOrdersLoaded
                ? this.props.filledOrders.map((order) => {
                    return (
                      <tbody className={`order-${order.id}`} key={order.id}>
                        <tr>
                          <td className= "text-muted">{order.formattedTimeStamp}</td>
                          <td>{order.tokenAmount}</td>
                          <td className={`text-${order.tokenPriceClass}`}>{order.tokenPrice}</td>
                        </tr>
                      </tbody>
                    )
                  })
                : <Spinner type="table"/>
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
