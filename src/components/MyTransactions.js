import React, { Component } from 'react'
import {Tabs, Tab} from 'react-bootstrap'

import Loader from './Loader'

import {connect} from 'react-redux'

import {
	myFilledOrdersLoadedSelector, 
	myFilledOrdersSelector,
	myOpenOrdersLoadedSelector,
	myOpenOrdersSelector
} from '../store/selectors'

const showMyFilledOrders = (myfilledOrders) =>{
  return(
    <tbody>
      { myfilledOrders.map((order) => {
        return(
          <tr className={`order-${order.id}`} key={order.id}>
            <td className= "text-muted">{order.formattedTimeStamp}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.orderSignClass}{order.tokenAmount}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
          </tr>
        )
      })}
    </tbody>)
}

const showMyOpenOrders = myopenOrders =>{
	return(
		<tbody>
      { myopenOrders.map((order) => {
        return(
          <tr className={`order-${order.id}`} key={order.id}>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenAmount}</td>
            <td className="text-muted">x</td>
          </tr>
        )
      })}
    </tbody>)
}

class MyTransactions extends Component{
	render(){
		return (
			<div className="card bg-dark text-white">
				<div className="card-header d-flex align-items-center">
					<span>My Transactions</span>
          {this.props.myFilledOrdersLoaded && this.props.myOpenOrdersLoaded
            ?<span></span>
            :<Loader type="header"/>
          }
				</div>
				<div className="card-body">
					<Tabs defaultActiveKey="trades" className="bg-dark text-white">
						<Tab eventKey="trades" title="Trades" className="bg-dark">
							<table className="table table-dark table-sm small">
								<thead>
									<tr>
										<th>Time Executed</th>
										<th>POI</th>
										<th>POI/ETH</th>
									</tr>
								</thead>
								{this.props.myFilledOrdersLoaded
		              ?showMyFilledOrders(this.props.myFilledOrders)
		              :<tbody></tbody>
		            }
							</table>
						</Tab>
						<Tab eventKey="orders" title="Orders">
							<table className="table table-dark table-sm small">
								<thead>
									<tr>
										<th>Amount</th>
										<th>POI/ETH</th>
										<th>Cancel</th>
									</tr>
								</thead>
								{this.props.myOpenOrdersLoaded
		              ?showMyOpenOrders(this.props.myOpenOrders)
		              :<tbody></tbody>
		            }
							</table>
						</Tab>
					</Tabs>
				</div>
			</div>
		)
	}
}
function mapStateToProps(state){
  return {
    myFilledOrdersLoaded: myFilledOrdersLoadedSelector(state),
    myFilledOrders: myFilledOrdersSelector(state),
    myOpenOrdersLoaded: myOpenOrdersLoadedSelector(state),
    myOpenOrders: myOpenOrdersSelector(state)
  }
}
export default connect(mapStateToProps)(MyTransactions);