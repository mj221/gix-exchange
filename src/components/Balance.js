import React, { Component} from 'react'
import {connect} from 'react-redux'

import {
	loadBalances, 
	depositEth, 
	loadAccount, 
	withdrawEth,
	depositToken,
	withdrawToken,
}from '../store/interactions'

import Loader from './Loader'

import {Tabs, Tab} from 'react-bootstrap'

import {
	accountSelector,
	tokenSelector,
	exchangeSelector,
	web3Selector,
	ethBalanceSelector,
	tokenBalanceSelector,
	exchangeEthBalanceSelector,
	exchangeTokenBalanceSelector,
	balancesLoadingSelector,
	ethDepositAmountSelector,
	ethWithdrawAmountSelector,
	tokenDepositAmountSelector,
	tokenWithdrawAmountSelector,
} from '../store/selectors'

import {
	ethDepositAmountChanged,
	balancesLoading, 
	ethWithdrawAmountChanged,
	tokenDepositAmountChanged,
	tokenWithdrawAmountChanged
} from '../store/actions'


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
class Balance extends Component{
	constructor(props) {
    super(props)
    this.state = {
      ethDepositAmount: 0,
      ethWithdrawAmount: 0,
      tokenDepositAmount: 0,
      tokenWithdrawAmount: 0
    }
  }
	async componentDidMount(){
		const {exchange, dispatch} = this.props
 		this.loadBlockchainData()
		window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts[0] == null){
        this.setState({ethDepositAmount: 0})
        this.setState({ethWithdrawAmount: 0})
        this.setState({tokenDepositAmount: 0})
        this.setState({tokenWithdrawAmount: 0})
        dispatch(ethDepositAmountChanged(this.state.ethDepositAmount))
        dispatch(ethWithdrawAmountChanged(this.state.ethWithdrawAmount))
        dispatch(tokenDepositAmountChanged(this.state.tokenDepositAmount))
        dispatch(tokenWithdrawAmountChanged(this.state.tokenWithdrawAmount))
      }
  		dispatch(balancesLoading())
      this.loadBlockchainData()
      
    });
    await exchange.events.Deposit({}, (error, event) =>{
    	dispatch(balancesLoading())
			this.loadBlockchainData()
		})
		await exchange.events.Withdraw({}, (error, event) =>{
			dispatch(balancesLoading())
			this.loadBlockchainData()
		})

		await exchange.events.Trade({}, (error, event) =>{
			dispatch(balancesLoading())
			this.loadBlockchainData()
		})
    
	}

	loadBlockchainData(){
		const interval = setInterval(async () => {
			const {dispatch, web3, exchange, token, account} = this.props
			
				clearInterval(interval)
				await loadBalances(web3, exchange, token, account, dispatch)
				return;

		}, 1000);
	}

	showForm = (props) =>{
		const{
			ethBalance,
			tokenBalance,
			exchangeEthBalance,
			exchangeTokenBalance,
			dispatch,
			ethDepositAmount,
			ethWithdrawAmount,
			tokenDepositAmount,
			tokenWithdrawAmount,
			exchange,
			token,
			account,
			web3
		} = props

		return (
			<Tabs fill justify defaultActiveKey="deposit" className="bg-dark text-white">
		{/*DEPOSITS*/}
				<Tab style={{ textAlign: "center" }} tabClassName="balance-tab-config" eventKey="deposit" title="Deposit" className="bg-dark text-white">
					<table className="table table-dark table-sm small table-hover">
						<thead>
							<tr>
								<th>Currency</th>
								<th>Wallet</th>
								<th>Exchange</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>ETH</td>
								<td>{ethBalance}</td>
								<td>{exchangeEthBalance}</td>
							</tr>
							<tr>
								<td>POI</td>
								<td>{tokenBalance}</td>
								<td>{exchangeTokenBalance}</td>
							</tr>
						</tbody>
					</table>

				{/*ETH DEPOSITS*/}
					<form className="row" onSubmit = {async (e) => {
						e.preventDefault()
						if (ethDepositAmount !== null) {
							await depositEth(exchange, web3, ethDepositAmount, account, dispatch)
							dispatch(ethDepositAmountChanged(this.state.ethDepositAmount))
						}

					}}>
						<div className="col-sm d-flex">
							<input
								type="text"
								placeholder = "ETH Amount"
								value={this.state.ethDepositAmount}
								onChange={(event) => {if (isNaN(Number(event.target.value))) {
														            return;
														          } else {
														          	this.setState({ethDepositAmount: event.target.value})
														            dispatch(ethDepositAmountChanged(event.target.value))
														          }

																			}}
								className="form-control form-control-sm bg-dark text-white"
								required
							>
							</input>
							<div>
								<button 
									onMouseOver={(event)=>{event.target.style.borderColor = 'white'}} 
									onMouseLeave={(event) => {event.target.style.borderColor= 'transparent'}}
									style={{backgroundColor: '#1d1d1d', color:'white'}} 
									type="submit" className="btn btn-block btn-sm"
									onClick={() => account === '' ? configMetaMask(dispatch) : null}
									>
									Deposit
								</button>
							</div>
						</div>
						
					</form>

					<hr/>
				{/*TOKEN DEPOSITS*/}

					<form className="row" onSubmit = {async (e) => {
						e.preventDefault()
						await depositToken(exchange, web3, tokenDepositAmount, account, token, dispatch)
						dispatch(tokenDepositAmountChanged(this.state.tokenDepositAmount))
					}}>
						<div className="col-sm d-flex">
							<input
								type="text"
								placeholder = "POI Amount"
								value= {this.state.tokenDepositAmount}
								onChange={(event) => {if (isNaN(Number(event.target.value))) {
														            return;
														          } else {
														          	this.setState({tokenDepositAmount: event.target.value})
														            dispatch(tokenDepositAmountChanged(event.target.value))
														          }

																			}}
								className="form-control form-control-sm bg-dark text-white"
								required
							>
							</input>
							<div>
								<button 
									onMouseOver={(event)=>{event.target.style.borderColor = 'white'}} 
									onMouseLeave={(event) => {event.target.style.borderColor= 'transparent'}}
									style={{backgroundColor: '#1d1d1d', color:'white'}} 
									type="submit" className="btn btn-block btn-sm"
									onClick={() => account === '' ? configMetaMask(dispatch) : null}
									>
									Deposit
								</button>
							</div>
						</div>
					</form>

				</Tab>
			{/*------------------------------------------------*/}
		{/*WITHDRAWALS*/}
				<Tab style={{ textAlign: "center" }} tabClassName="balance-tab-config" eventKey="withdraw" title="Withdraw">
					<table className="table table-dark table-sm small table-hover">
						<thead>
							<tr>
								<th>Currency</th>
								<th>Wallet</th>
								<th>Exchange</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>ETH</td>
								<td>{ethBalance}</td>
								<td>{exchangeEthBalance}</td>
							</tr>
							<tr>
								<td>POI</td>
								<td>{tokenBalance}</td>
								<td>{exchangeTokenBalance}</td>
							</tr>
						</tbody>
					</table>
				{/*ETH WITHDRAWALS*/}
					<form className="row" onSubmit = {async (e) => {
						e.preventDefault()
						await withdrawEth(exchange, web3, ethWithdrawAmount, account, dispatch)
						dispatch(ethWithdrawAmountChanged(this.state.ethWithdrawAmount))
					}}>
						<div className="col-sm d-flex">
							<input
								type="text"
								placeholder = "ETH Amount"
								value={this.state.ethWithdrawAmount}
								onChange={(event) => {if (isNaN(Number(event.target.value))) {
														            return;
														          } else {
														          	this.setState({ethWithdrawAmount: event.target.value})
														            dispatch(ethWithdrawAmountChanged(event.target.value))
														          }

																			}}
								className="form-control form-control-sm bg-dark text-white"
								required
							>
							</input>
							<div>
								<button 
									onMouseOver={(event)=>{event.target.style.borderColor = 'white'}} 
									onMouseLeave={(event) => {event.target.style.borderColor= 'transparent'}}
									style={{backgroundColor: '#1d1d1d', color:'white'}} 
									type="submit" className="btn btn-block btn-sm balance-button"
									onClick={() => account === '' ? configMetaMask(dispatch) : null}
									>
									Withdraw
								</button>
							</div>
						</div>
						
					</form>
					<hr/>

					<form className="row" onSubmit = {async (e) => {
						e.preventDefault()
						await withdrawToken(exchange, web3, tokenWithdrawAmount, account, token, dispatch)
						dispatch(tokenWithdrawAmountChanged(this.state.tokenWithdrawAmount))
					}}>
						<div className="d-flex">
							<input
								type="text"
								placeholder = "POI Amount"
								value= {this.state.tokenWithdrawAmount}
								onChange={(event) => {if (isNaN(Number(event.target.value))) {
														            return;
														          } else {
														          	this.setState({tokenWithdrawAmount: event.target.value})
														            dispatch(tokenWithdrawAmountChanged(event.target.value))
														          }

																			}}
								className="form-control form-control-sm bg-dark text-white"
								required
							>
							</input>
							<div>
								<button 
									onMouseOver={(event)=>{event.target.style.borderColor = 'white'}} 
									onMouseLeave={(event) => {event.target.style.borderColor= 'transparent'}}
									style={{backgroundColor: '#1d1d1d', color:'white'}} 
									type="submit" className="btn btn-block btn-sm balance-button"
									onClick={() => account === '' ? configMetaMask(dispatch) : null}
									>
									Withdraw
								</button>
							</div>
						</div>
						
					</form>
				</Tab>
			</Tabs>
		)
	}

	render(){

		return (
			<div className="card bg-dark text-white">
				<div className="card-header d-flex align-items-center" style={{justifyContent: 'space-between'}}>
					<span>Balance</span>
          {!this.props.balancesLoading
            ?<span></span>
            :<div>{this.props.account !== ""?<Loader type="header"/>:<div></div>}</div>
          }
				</div>
				<div className="card-body">
					{/*{!this.props.balancesLoading
						?showForm(this.props)
						:<span>Account Loading</span>
					}*/}
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
  	ethBalance: ethBalanceSelector(state),
  	tokenBalance: tokenBalanceSelector(state),
  	exchangeEthBalance: exchangeEthBalanceSelector(state),
  	exchangeTokenBalance: exchangeTokenBalanceSelector(state),
  	balancesLoading: balancesLoadingSelector(state),
  	ethDepositAmount: ethDepositAmountSelector(state),
  	ethWithdrawAmount: ethWithdrawAmountSelector(state),
  	tokenDepositAmount: tokenDepositAmountSelector(state),
  	tokenWithdrawAmount: tokenWithdrawAmountSelector(state)
  }
}
export default connect(mapStateToProps)(Balance);


