import React, { Component } from 'react';
import {connect} from 'react-redux'  // required to connect redux and app. Go to bottom page for config.

import {loadAllOrders} from '../store/interactions'
import {exchangeSelector} from '../store/selectors'

import Trades from './Trades'
import OrderBook from './OrderBook'
import MyTransactions from './MyTransactions'

class Content extends Component {
  componentDidMount(){
    this.loadBlockchainData(this.props.dispatch)
  }
  async loadBlockchainData(dispatch){
    await loadAllOrders(this.props.exchange, dispatch)
  }
  render(){
    return(
      <div>
        <div className="content"> 
          {/*--------------------------------*/}
          <div className="vertical-split">

            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title1
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>

            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title2
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>

          </div>
          {/*--------------------------------*/}
          <div className="vertical">
            <OrderBook />
          </div>
          {/*--------------------------------*/}
          <div className="vertical-split">

            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title4
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>

            <MyTransactions />

          </div>
          {/*--------------------------------*/}
          <div className="vertical">
            <Trades />
          </div>
          {/*--------------------------------*/}
        </div>
        {/*--------------------------------*/}
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    exchange: exchangeSelector(state)
  }
}
export default connect(mapStateToProps)(Content);
