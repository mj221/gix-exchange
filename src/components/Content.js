import React, { Component } from 'react';
import {connect} from 'react-redux'  // required to connect redux and app. Go to bottom page for config.

import {loadAllOrders, subscribeToEvents} from '../store/interactions'
import {exchangeSelector} from '../store/selectors'

import Trades from './Trades'
import OrderBook from './OrderBook'
import MyTransactions from './MyTransactions'
import PriceChart from './PriceChart'
import Balance from './Balance'
import NewOrder from './NewOrder'

import Footer from './Footer'

class Content extends Component {
  componentDidMount(){
    this.loadBlockchainData(this.props)
  }
  async loadBlockchainData(props){
    const {exchange, dispatch} = props

    await loadAllOrders(exchange, dispatch)
    await subscribeToEvents(exchange, dispatch)
  }
  render(){
    // return(
    //   <div>
    //     <div className="content"> 
    //       {/*--------------------------------*/}
    //       <div className="vertical-split">

    //         <Balance/>

    //         <NewOrder/>

    //       </div>
    //       {/*--------------------------------*/}
    //       <div className="vertical">
    //         <OrderBook />
    //       </div>
    //       {/*--------------------------------*/}
    //       <div className="vertical-split">

    //         <PriceChart />

    //         <MyTransactions />

    //       </div>
    //       {/*--------------------------------*/}
    //       <div className="vertical">
    //         <Trades />
    //       </div>
    //       {/*--------------------------------*/}
    //     </div>
    //     {/*--------------------------------*/}
    //   </div>
    // )
    return (
    

        <div className="content-all">
          {/*-----------------------*/}
          <div className="content"> 
            {/*----------*/}
                <div className="vertical">
                  <PriceChart />
                </div>
              
                <div className="vertical-split">
                  <OrderBook />
                  <Trades />   
                </div>
                
           
                <div className="vertical-split">
                  <NewOrder/>
                  <Balance/>     
                </div>
                {/*----------*/}
          </div>

          <div className="content2">
            <MyTransactions />
          </div>
          {/*----------------------*/}
            <Footer/>
        </div>
    )
  }
}

function mapStateToProps(state){
  return {
    exchange: exchangeSelector(state)
  }
}
export default connect(mapStateToProps)(Content);
