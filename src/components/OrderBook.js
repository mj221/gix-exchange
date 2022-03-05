import React, { Component } from 'react';
import {connect} from 'react-redux'  // required to connect redux and app. Go to bottom page for config.

import {
  orderBookLoaded,
  orderBookSelector,
  accountSelector,
  exchangeSelector,
  orderFillingSelector
} from '../store/selectors'

import {fillOrder} from '../store/interactions'

import Loader from './Loader'
import {Tooltip, OverlayTrigger} from 'react-bootstrap'

const renderOrder = (order, props) =>{
  const {exchange, account, dispatch} =  props
  return(
    <OverlayTrigger
      key={order.id}
      placement='auto'
      overlay={
        <Tooltip id={order.id}>
          {`Click here to ${order.orderFillAction}`}
        </Tooltip>  
      }
    >
      <tr 
        key={order.id} 
        className="order-book-order" 
        style={{fontSize: '13px'}}
        onClick={(e) => fillOrder(exchange, order, account, dispatch)}
      >
        <td>{order.tokenAmount}</td>
        <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
        <td>{order.etherAmount}</td>
      </tr>
    </OverlayTrigger>
  )
}

const showOrderBook = (props) =>{
  const {orderBook} = props 
  return (
    <tbody>
      {orderBook.sellOrders.map((order) => renderOrder(order, props))}
      <tr>
        <th>POI</th>
        <th>POI/ETH</th>
        <th>ETH</th>
      </tr>
      {orderBook.buyOrders.map((order) => renderOrder(order, props))}
    </tbody>
  )
}

class OrderBook extends Component {
  render(){
    return(
      <div className="card bg-dark text-white">

        <div className="card-header d-flex align-items-center">
          
          <span>Order Book</span>
          {this.props.orderBookLoaded & !this.props.orderFilling
            ?<span></span>
            :<Loader type="header"/>
          }
          {/*{console.log("Loaded:", this.props.orderBookLoaded)}
          {console.log("SHOW:", this.props.showOrderBook)}*/}
        </div>

        <div className="card-body order-book">
          <table className="table table-dark table-sm small table-hover">
            {this.props.orderBookLoaded
              ?showOrderBook(this.props)
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
    orderBook: orderBookSelector(state),
    account: accountSelector(state),
    exchange: exchangeSelector(state),
    orderFilling: orderFillingSelector(state)
  }
}
export default connect(mapStateToProps)(OrderBook);
