import React, { Component} from 'react'
import {connect} from 'react-redux'

import {Tabs, Tab} from 'react-bootstrap'
// import Loader from './Loader'

import './App.css';
// import "bootstrap/dist/css/bootstrap.min.css";

import {
	myFilledOrdersLoadedSelector, 
	myFilledOrdersSelector,
	myOpenOrdersLoadedSelector,
	myOpenOrdersSelector,
	accountSelector,
	exchangeSelector,
	orderCancellingSelector,
	myOrderHistoryLoadedSelector,
	myOrderHistorySelector,

} from '../store/selectors'

import {cancelOrder} from '../store/interactions'

const showMyFilledOrders = (myfilledOrders) =>{
  return(
    <tbody>
      { myfilledOrders.map((order) => {
        return(
          <tr style={{fontSize: '13px'}} className={`order-${order.id}`} key={order.id}>
            <td className= "text-muted">{order.formattedTimeStamp}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.orderSignClass}{order.tokenAmount}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
          </tr>
        )
      })}
    </tbody>)
}

const showMyOpenOrders = (props) =>{

	const {myOpenOrders, orderCancelling, dispatch, account, exchange} = props
	return(
		<tbody>
      { myOpenOrders.map((order) => {
        return(
          <tr style = {{verticalAlign: 'baseline'}} className={`order-${order.id}`} key={order.id}>
          	<td className= "text-muted">{order.formattedTimeStamp}</td>
	          <td style = {{verticalAlign: 'baseline'}} className={`text-${order.orderTypeClass}`}>{order.tokenAmount}</td>
            <td style = {{verticalAlign: 'baseline'}} className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
            <td 
            	style = {{verticalAlign: 'baseline'}} 
            	className="text-muted"
            	>
	        			<button 
	        				key={order.id}
	        				name={order.id}
	        				style={{backgroundColor: '#1d1d1d', color:'white'}}
	        				className="btn btn-dark btn-sm"
	        				onMouseOver={(event)=>{event.target.style.borderColor = 'white'}} 
									onMouseLeave={(event) => {event.target.style.borderColor= 'transparent'}}
	        				onClick={(event) => {
	        					if(!orderCancelling){
	        						cancelOrder(exchange, order, account, dispatch)
	        					}
		            		
		            	}}
	        				>
	        				<span>Cancel</span>
	      				</button>
            </td>
          </tr>
        )
      })}
    </tbody>)
}
const showMyAllOrders = (myallOrders) =>{
	return (
		<tbody>
			{myallOrders.map((order) => {
				return (
					<tr style={{fontSize: '13px'}} className={`order-${order.id}`} key={order.id}>
            <td className= "text-muted">{order.formattedTimeStamp}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.orderType}</td>
            <td>{order.tokenAmount}</td>
            <td>{order.tokenPrice}</td>
            <td>{order.orderStatus}</td>
          </tr>
				)
			})}
		</tbody>
	)
}

class MyTransactions extends Component{

	render(){
		return (
			<div className="card bg-dark text-white">
				
				{/*<div className="card-header d-flex align-items-center" style={{justifyContent: 'space-between'}}>
					<span>My Transactions</span>
          {this.props.myFilledOrdersLoaded && this.props.myOpenOrdersLoaded && !this.props.orderCancelling
            ?<span></span>
            :<Loader type="header"/>
          }
				</div>*/}

				<div className="card-body">
					<Tabs fill justify defaultActiveKey="open-orders" className="bg-dark text-white">
						<Tab tabClassName="transactions-tab-config" eventKey="open-orders" title="Open Orders">
							<table className="table table-dark table-sm small table-hover">
								<thead>
									<tr className="text-muted" >
										<th>Time</th>
										<th>Filled Size/Order Size (POI)</th>
										<th>Price (POI/ETH)</th>
										<th></th>
									</tr>
								</thead>
								{this.props.myOpenOrdersLoaded
		              ?showMyOpenOrders(this.props)
		              :<tbody></tbody>
		            }
							</table>
						</Tab>
						<Tab tabClassName="transactions-tab-config" eventKey="order-history" title="Order History">
							<table className="table table-dark table-sm small table-hover">
								<thead>
									<tr className="text-muted">
										<th>Time</th>
										<th>Side</th>
										<th>Filled Size/Order Size (POI)</th>
										<th>Price (POI/ETH)</th>
										<th>Status</th>
									</tr>
								</thead>
								{this.props.myOpenOrdersLoaded
		              ?showMyAllOrders(this.props.myOrderHistory)
		              :<tbody></tbody>
		            }
							</table>
						</Tab>
						<Tab tabClassName="transactions-tab-config" eventKey="trade-history" title="Trade History" className="bg-dark text-white">
							<table className="table table-dark table-sm small table-hover">
								<thead>
									<tr className="text-muted">
										<th>Time</th>
										<th>Filled Size/Order Size (POI)</th>
										<th>Price (POI/ETH)</th>
									</tr>
								</thead>
								{this.props.myFilledOrdersLoaded
		              ?showMyFilledOrders(this.props.myFilledOrders)
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
    myOpenOrders: myOpenOrdersSelector(state),
    myOrderHistoryLoaded: myOrderHistoryLoadedSelector(state),
    myOrderHistory: myOrderHistorySelector(state),
    orderCancelling: orderCancellingSelector(state),
    account: accountSelector(state),
    exchange: exchangeSelector(state)
  }
}
export default connect(mapStateToProps)(MyTransactions);