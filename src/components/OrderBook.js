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

import './App.css'

const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class OrderBook extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRow : ""
    }
  }
  renderTableAnimation= (selectedRow) =>{
    if(selectedRow !== ""){
      this.setState({selectedRow})
    }else{
      this.setState({selectedRow: ""})
    }
  }
  renderOrder = (order, props) =>{
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
          onClick={async (e) => {
            fillOrder(exchange, order, account, dispatch)
            this.renderTableAnimation(order.id)
            await wait(1)
            this.renderTableAnimation("")
          }}
          
        >
          <td className={`${this.state.selectedRow === order.id ? "tableBuySelected" : "tableReset"}`}>{order.tokenAmount}</td>
          <td className={`text-${order.orderTypeClass} ${this.state.selectedRow===order.id?"tableBuySelected":"tableReset"}`}>{Math.round(order.tokenPrice * (10**5)) / 10**5}</td>
          <td className={`${this.state.selectedRow === order.id ? "tableBuySelected" : "tableReset"}`}>{Math.round(order.etherAmount * (10**5))/10**5}</td>
        </tr>
      </OverlayTrigger>
    )
  }
  renderOrder2 = (order, props) =>{
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
          onClick={async (e) => {
            fillOrder(exchange, order, account, dispatch)
            this.renderTableAnimation(order.id)
            await wait(1)
            this.renderTableAnimation("")
          }}
        >
          <td className={`${this.state.selectedRow === order.id ? "tableSellSelected" : "tableReset"}`}>{Math.round(order.etherAmount * (10**5))/10**5}</td>
          <td className={`text-${order.orderTypeClass} ${this.state.selectedRow===order.id?"tableSellSelected":"tableReset"}`}>{Math.round(order.tokenPrice * (10**5)) / 10**5}</td>
          <td className={`${this.state.selectedRow === order.id ? "tableSellSelected" : "tableReset"}`}>{order.tokenAmount}</td>
        </tr>
      </OverlayTrigger>
    )
  }


  showOrderBook = (props) =>{
    const {orderBook} = props 
    return (
      <tbody>
        <tr className="text-muted" style={{fontSize: '10px'}}>
          <th>Bid Size (POI)</th>
          <th>Bid Price (POI/ETH)</th>
          <th>ETH</th>
        </tr>
        {orderBook.buyOrders.map((order) => this.renderOrder(order, props))}
      </tbody>

    )
  }
  showOrderBook2 = (props) =>{
    const {orderBook} = props 
    return (
      <tbody>
        <tr className="text-muted" style={{fontSize: '10px'}}>
          <th>ETH</th>
          <th>Ask Price (POI/ETH)</th>
          <th>Ask Size (POI)</th>
        </tr>
        {orderBook.sellOrders.map((order) => this.renderOrder2(order, props))}
      </tbody>

    )
  }
  render(){
    return(
      <div className="card bg-dark text-white">

        <div className="card-header d-flex align-items-center" style={{justifyContent: 'space-between'}}>
          
          <span>Order Book</span>
          {this.props.orderBookLoaded & !this.props.orderFilling
            ?<span></span>
            :<Loader type="header"/>
          }
          {/*{console.log("Loaded:", this.props.orderBookLoaded)}
          {console.log("SHOW:", this.props.showOrderBook)}*/}
        </div>

        <div className="card-body order-book">
          <table className="table table-dark table-sm small table-hover buyTable">
            {this.props.orderBookLoaded
              ?this.showOrderBook(this.props)
              :<tbody><tr><th></th></tr></tbody>
            }
          </table>
          <table className="table table-dark table-sm small table-hover sellTable">
            {this.props.orderBookLoaded
              ?this.showOrderBook2(this.props)
              :<tbody><tr><th></th></tr></tbody>
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
