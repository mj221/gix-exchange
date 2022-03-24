import React, { Component} from 'react'
import {connect} from 'react-redux'

import {
	loadAccount,
	makeBuyOrder,
	makeSellOrder
}from '../store/interactions'

import Loader from './Loader'

import {Tabs, Tab} from 'react-bootstrap'

import {
	accountSelector,
	tokenSelector,
	exchangeSelector,
	web3Selector,
	buyOrderMakingSelector,
	sellOrderMakingSelector,
	buyOrderSelector,
	sellOrderSelector,
	buyOrderPriceSelector,
	buyOrderAmountSelector,
	sellOrderAmountSelector,
	sellOrderPriceSelector,
	priceChartSelector
} from '../store/selectors'

import {
	buyOrderAmountChanged,
	buyOrderPriceChanged,
	sellOrderAmountChanged,
	sellOrderPriceChanged,
	balancesLoading
} from '../store/actions'

import {
	loadBalances
}from '../store/interactions'

const configMetaMask = async (dispatch) => {
  if(window.ethereum){
    try{
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if(accounts !== null){
        await loadAccount(accounts[0], dispatch)
      }
    }catch (err){
      if (err.code === 4001){
        console.log("User denied MetaMask. Please connect MetaMask again.")
      }else{
        console.log(err)
      }
    }
    
  }else{
    window.alert("Non-Ethereum browser detected. Try using MetaMask.")
  }
}
class NewOrder extends Component{
	constructor(props) {
    super(props)
    this.state = {
      buyAmountValue: "",
      buyPriceValue: "",
      sellAmountValue: "",
      sellPriceValue: ""
    }
  }
  async componentDidMount(){
		const {exchange, dispatch} = this.props

		await exchange.events.Order({}, (error, event) =>{
			dispatch(balancesLoading())
			this.loadBlockchainData()
		}) 
	}
	loadBlockchainData(){
		const interval = setInterval(async () => {
		
			clearInterval(interval)
			const {dispatch, web3, exchange, token, account} = this.props
			await loadBalances(web3, exchange, token, account, dispatch)
			return;
			
		}, 1000);
	}
	showForm = (props) =>{
		const{
			exchange,
			token,
			web3,
			account,
			dispatch,
			buyOrder,
			sellOrder,
			buyOrderPrice,
			buyOrderAmount,
			sellOrderPrice,
			sellOrderAmount
		} = props

		return (
			<Tabs fill justify defaultActiveKey="buy" className="bg-dark text-white">

				<Tab tabClassName="newOrder-tab-config" eventKey="buy" title="Buy" className="bg-dark text-white">
					<form className="row" id="buyForm" onSubmit = {async (e) => {
						e.preventDefault()
						if (buyOrder !== null){
							await makeBuyOrder(exchange, token, web3, buyOrder, account, dispatch)
							dispatch(buyOrderAmountChanged(this.state.buyAmountValue))
							dispatch(buyOrderPriceChanged(this.state.buyPriceValue))
						}
					}}>
						<div className="form-group small mb-2 mt-1">
							<label>Buy Amount (POI)</label>
							<div className="input-group">
								<input
									type="text"
									placeholder = "Buy Amount"
									value={this.state.buyAmountValue}
									maxLength="8"
									onChange={(event) => {if (isNaN(Number(event.target.value))) {
													            return;
													          } else {
													            this.setState({ buyAmountValue: event.target.value });
													            dispatch(buyOrderAmountChanged(event.target.value))
													          }

																		}}
									className="form-control form-control-sm bg-dark text-white"
									required
								/>
							</div>
						</div>
						<div className="form-group small mb-3">
							<div className= "d-flex align-items-center" style={{justifyContent: 'space-between'}}>
								<label>Buy Price</label>
								<label className="latestPrice">
									<small 
										className="text-muted" 
										onClick={()=>this.setState({buyPriceValue: this.props.priceChart.lastPrice})}
									>
										{this.props.priceChart.lastPrice}
									</small>
								</label>
							</div>
							
							<div className="input-group">
								<input
									type="text"
									placeholder = "Buy Price"
									value={this.state.buyPriceValue}
									maxLength="8"
									onChange={(event) => {if (isNaN(Number(event.target.value))) {
													            return;
													          } else {
													            this.setState({ buyPriceValue: event.target.value });
													            dispatch(buyOrderPriceChanged(event.target.value))
													          }

																		}}
									className="form-control form-control-sm bg-dark text-white"
									required
								/>
							</div>
						</div>

						<table className="table table-dark table-sm small mb-1">
							<tbody>
								<tr>
									<td style={{textAlign:"left"}}>Total</td>
									<td style={{textAlign:"center"}}>{Math.round(this.state.buyAmountValue * this.state.buyPriceValue * (10**6)) / (10**6)}</td>
									<td style={{textAlign:"right"}}>ETH</td>
								</tr>
							</tbody>
						</table>
						<button 
							onMouseOver={(event)=>{event.target.style.borderColor = 'white'}} 
							onMouseLeave={(event) => {event.target.style.borderColor= 'transparent'}}
							// disabled = {this.props.buyOrderMaking}
							style={{backgroundColor: '#1d1d1d', color:'white'}} 
							type="submit" className="btn btn-block btn-sm mb-0"
							onClick={() => account === '' ? configMetaMask(dispatch) : null}
							>
							Buy
						</button>
						
					</form>

				</Tab>
			{/*------------------------------------------------*/}
				<Tab tabClassName="newOrder-tab-config" eventKey="sell" title="Sell">
					<form className="row" id="sellForm" onSubmit = {async (e) => {
						e.preventDefault()
						if (sellOrder !== null){
							await makeSellOrder(exchange, token, web3, sellOrder, account, dispatch)
							dispatch(sellOrderAmountChanged(this.state.sellAmountValue))
							dispatch(sellOrderPriceChanged(this.state.sellPriceValue))
						}
					}}>
						<div className="form-group small mb-2 mt-1">
							<label>Sell Amount (POI)</label>
							<div className="input-group">
								<input
									type="text"
									placeholder = "Sell Amount"
									value={this.state.sellAmountValue}
									maxLength="8"
									onChange={(event) => {if (isNaN(Number(event.target.value))) {
													            return;
													          } else {
													            this.setState({ sellAmountValue: event.target.value });
													            dispatch(sellOrderAmountChanged(event.target.value))
													          }

																		}}
									className="form-control form-control-sm bg-dark text-white"
									required
								/>
							</div>
						</div>
						<div className="form-group small mb-3">
							<div className= "d-flex align-items-center" style={{justifyContent: 'space-between'}}>
								<label>Sell Price</label>
								<label className="latestPrice">
									<small 
										className="text-muted" 
										onClick={()=>this.setState({sellPriceValue: this.props.priceChart.lastPrice})}
									>
										{this.props.priceChart.lastPrice}
									</small>
								</label>
							</div>
							<div className="input-group">
								<input
									type="text"
									placeholder = "Sell Price"
									value={this.state.sellPriceValue}
									maxLength="8"
									onChange={(event) => {if (isNaN(Number(event.target.value))) {
													            return;
													          } else {
													            this.setState({ sellPriceValue: event.target.value });
													            dispatch(sellOrderPriceChanged(event.target.value))
													          }
																		}}
									className="form-control form-control-sm bg-dark text-white"
									required
								/>
							</div>
						</div>
						<table className="table table-dark table-sm small mb-1">
							<tbody>
								<tr>
									<td style={{textAlign:"left"}}>Total</td>
									<td style={{textAlign:"center"}}>{Math.round(this.state.sellAmountValue * this.state.sellPriceValue * (10**6)) / (10**6)}</td>
									<td style={{textAlign:"right"}}>ETH</td>
								</tr>
							</tbody>
						</table>
						<button 
							onMouseOver={(event)=>{event.target.style.borderColor = 'white'}} 
							onMouseLeave={(event) => {event.target.style.borderColor= 'transparent'}}
							// disabled = {this.props.sellOrderMaking}
							style={{backgroundColor: '#1d1d1d', color:'white'}} 
							type="submit" className="btn btn-block btn-sm"
							onClick={() => account === '' ? configMetaMask(dispatch) : null}
							>
							Sell
						</button>
					</form>
				</Tab>
			</Tabs>
		)
	}
	render(){

		return (
			<div className="card bg-dark text-white">
				<div className="card-header d-flex align-items-center" style={{justifyContent: 'space-between'}}>
					<span>New Order</span>
          {!this.props.buyOrderMaking && !this.props.sellOrderMaking
            ?<span></span>
            :<Loader type="header"/>
          }
				</div>
				<div className="card-body">
					{this.showForm(this.props)}
				</div>
			</div>
		)
	}
}
function mapStateToProps(state){
  return {
  	account: accountSelector(state),
  	token: tokenSelector(state),
  	exchange: exchangeSelector(state),
  	web3: web3Selector(state),
  	buyOrderMaking: buyOrderMakingSelector(state),
  	sellOrderMaking: sellOrderMakingSelector(state),
  	buyOrder: buyOrderSelector(state),
  	sellOrder: sellOrderSelector(state),
  	buyOrderPrice: buyOrderPriceSelector(state),
  	buyOrderAmount: buyOrderAmountSelector(state),
  	sellOrderPrice: sellOrderPriceSelector(state),
  	sellOrderAmount: sellOrderAmountSelector(state),
  	priceChart: priceChartSelector(state)
  }
}
export default connect(mapStateToProps)(NewOrder);


