import React, { Component} from 'react'
import {connect} from 'react-redux'

import {
	loadBalances, 
	depositEth, 
	loadAccount, 
	withdrawEth,
	depositToken,
	withdrawToken
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
	tokenWithdrawAmountSelector
} from '../store/selectors'

import {
	ethDepositAmountChanged,
	balancesLoading, 
	ethWithdrawAmountChanged,
	tokenDepositAmountChanged,
	tokenWithdrawAmountChanged
} from '../store/actions'

const showForm = (props) =>{
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
							<th>Token</th>
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
					</tbody>
				</table>

			{/*ETH DEPOSITS*/}
				<form className="row" onSubmit = {(e) => {
					e.preventDefault()
					depositEth(exchange, web3, ethDepositAmount, account, dispatch)

				}}>
					<div className="col-12 col-sm pr-sm-2">
						<input
							type="text"
							placeholder = "ETH Amount"
							onChange={(event) => {if (isNaN(Number(event.target.value))) {
													            return;
													          } else {
													            dispatch(ethDepositAmountChanged(event.target.value))
													          }

																		}}
							className="form-control form-control-sm bg-dark text-white"
							required
						>
						</input>
					</div>
					<div className="col-12 col-sm-auto pl-sm-0">
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
				</form>

				<hr/>
			{/*TOKEN DEPOSITS*/}
				<table className="table table-dark table-sm small table-hover">
					<tbody>
						<tr>
							<td>POI</td>
							<td>{tokenBalance}</td>
							<td>{exchangeTokenBalance}</td>
						</tr>
					</tbody>
				</table>

				<form className="row" onSubmit = {(e) => {
					e.preventDefault()
					depositToken(exchange, web3, tokenDepositAmount, account, token, dispatch)

				}}>
					<div className="col-12 col-sm pr-sm-2">
						<input
							type="text"
							placeholder = "POI Amount"
							onChange={(event) => {if (isNaN(Number(event.target.value))) {
													            return;
													          } else {
													            dispatch(tokenDepositAmountChanged(event.target.value))
													          }

																		}}
							className="form-control form-control-sm bg-dark text-white"
							required
						>
						</input>
					</div>
					<div className="col-12 col-sm-auto pl-sm-0">
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
				</form>

			</Tab>
		{/*------------------------------------------------*/}
	{/*WITHDRAWALS*/}
			<Tab tabClassName="balance-tab-config" eventKey="withdraw" title="Withdraw">
				<table className="table table-dark table-sm small table-hover">
					<thead>
						<tr>
							<th>Token</th>
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
					</tbody>
					
				</table>
			{/*ETH WITHDRAWALS*/}
				<form className="row" onSubmit = {(e) => {
					e.preventDefault()
					withdrawEth(exchange, web3, ethWithdrawAmount, account, dispatch)

				}}>
					<div className="col-12 col-sm pr-sm-2">
						<input
							type="text"
							placeholder = "ETH Amount"
							onChange={(event) => {if (isNaN(Number(event.target.value))) {
													            return;
													          } else {
													            dispatch(ethWithdrawAmountChanged(event.target.value))
													          }

																		}}
							className="form-control form-control-sm bg-dark text-white"
							required
						>
						</input>
					</div>
					<div className="col-12 col-sm-auto pl-sm-0">
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
				</form>
				<hr/>
				<table className="table table-dark table-sm small table-hover">
					<tbody>
						<tr>
							<td>POI</td>
							<td>{tokenBalance}</td>
							<td>{exchangeTokenBalance}</td>
						</tr>
					</tbody>
				</table>

				<form className="row" onSubmit = {(e) => {
					e.preventDefault()
					withdrawToken(exchange, web3, tokenWithdrawAmount, account, token, dispatch)

				}}>
					<div className="col-12 col-sm pr-sm-2">
						<input
							type="text"
							placeholder = "POI Amount"
							onChange={(event) => {if (isNaN(Number(event.target.value))) {
													            return;
													          } else {
													            dispatch(tokenWithdrawAmountChanged(event.target.value))
													          }

																		}}
							className="form-control form-control-sm bg-dark text-white"
							required
						>
						</input>
					</div>
					<div className="col-12 col-sm-auto pl-sm-0">
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
				</form>
			</Tab>
		</Tabs>
	)
}

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
	async componentDidMount(){
		this.loadBlockchainData()
		window.ethereum.on('accountsChanged', (accounts) => {
      // console.log("Account changed: ", accounts) 
  		this.props.dispatch(balancesLoading())
      this.loadBlockchainData()
      
    });
    await this.props.exchange.events.Deposit({}, (error, event) =>{
			this.loadBlockchainData()
		})
		await this.props.exchange.events.Withdraw({}, (error, event) =>{
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

	render(){

		return (
			<div className="card bg-dark text-white">
				<div className="card-header d-flex align-items-center">
					<span>Balance</span>
          {!this.props.balancesLoading
            ?<span></span>
            :<Loader type="header"/>
          }
				</div>
				<div className="card-body">
					{/*{!this.props.balancesLoading
						?showForm(this.props)
						:<span>Account Loading</span>
					}*/}
					{showForm(this.props)}
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


