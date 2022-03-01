import React, { Component } from 'react';
import {connect} from 'react-redux'  // required to connect redux and app. Go to bottom page for config.

import {
  orderBookLoaded,
  orderBookSelector
} from '../store/selectors'

import Loader from './Loader'

const renderOrder = (order, orderBook) =>{
  return(
    <tr key={order.id}>
      <td>{order.tokenAmount}</td>
      <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
      <td>{order.etherAmount}</td>
    </tr>
  )
}

const showOrderBook = (orderBook) =>{
  return (
    <tbody>
      {orderBook.sellOrders.map((order) => renderOrder(order, orderBook))}
      <tr>
        <th>POI</th>
        <th>POI/ETH</th>
        <th>ETH</th>
      </tr>
      {orderBook.buyOrders.map((order) => renderOrder(order, orderBook))}
    </tbody>
  )
}

class OrderBook extends Component {
  render(){
    return(
      <div className="card bg-dark text-white">

        <div className="card-header d-flex align-items-center">
          
          <span>Order Book</span>
          {this.props.orderBookLoaded
            ?<span></span>
            :<Loader type="header"/>
          }
          {/*{console.log("Loaded:", this.props.orderBookLoaded)}
          {console.log("SHOW:", this.props.showOrderBook)}*/}
        </div>

        <div className="card-body order-book">
          <table className="table table-dark table-sm small">
            {this.props.orderBookLoaded
              ?showOrderBook(this.props.showOrderBook)
              :<tbody></tbody>
            }
          </table>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    orderBookLoaded: orderBookLoaded(state),
    showOrderBook: orderBookSelector(state)
  }
}
export default connect(mapStateToProps)(OrderBook);
