import Web3 from 'web3'
import {
	web3Loaded,
	web3AccountLoaded,
	tokenLoaded,
	exchangeLoaded,
	cancelledOrdersLoaded,
	filledOrdersLoaded,
	allOrdersLoaded,
	orderCancelling,
	orderCancelled,
	orderFilling,
	orderFilled,
	ethBalanceLoaded,
	tokenBalanceLoaded,
	exchangeEthBalanceLoaded,
	exchangeTokenBalanceLoaded,
	balancesLoaded,
	balancesLoading,
	buyOrderMaking,
	sellOrderMaking,
	orderMade
} from './actions'

import Exchange from '../abis/Exchange.json'
import PoiToken from '../abis/PoiToken.json'

import {
	ETHER_ADDRESS
} from '../helpers'

export const loadWeb3 = async (dispatch) =>{
	
	const web3 = new Web3(window.ethereum)

	dispatch(web3Loaded(web3))
	return web3
}

export const loadAccount = async (account, dispatch) => {

	dispatch(web3AccountLoaded(account))
	return account
}

export const loadToken = async(web3, networkId, dispatch) =>{
    var networkId_decimal = web3.utils.hexToNumberString(networkId)

	try{
		const token = await new web3.eth.Contract(PoiToken.abi, PoiToken.networks[networkId_decimal].address)
		dispatch(tokenLoaded(token))
		return token
	}catch (err){
		console.log("Contract not deployed on the current network.")
		return null
	}
}

export const loadExchange = async(web3, networkId, dispatch) =>{
    var networkId_decimal = web3.utils.hexToNumberString(networkId)

	try{
		const exchange = await new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId_decimal].address)
		dispatch(exchangeLoaded(exchange))
		return exchange
	}catch (err){
		console.log("GiX contract not deployed on the current network.")
		return null
	}
}


export const loadAllOrders = async (exchange, dispatch) => {
	// load cancelled orders
	const cancelStream = await exchange.getPastEvents('Cancel', {fromBlock: 0, toBlock: 'latest'})
	const cancelledOrders = cancelStream.map((event) => event.returnValues)  //returnValues from event log
	dispatch(cancelledOrdersLoaded(cancelledOrders))

	//load filled orders
	const tradeStream = await exchange.getPastEvents('Trade', {fromBlock: 0, toBlock: 'latest'})
	const filledOrders = tradeStream.map((event) => event.returnValues)
	dispatch(filledOrdersLoaded(filledOrders))

	// load all orders
	const orderStream = await exchange.getPastEvents('Order', {fromBlock:0, toBlock:'latest'})
	const allOrders = orderStream.map((event) => event.returnValues)
	dispatch(allOrdersLoaded(allOrders))
}

export const cancelOrder = async (exchange, order, account, dispatch) => {
	await exchange.methods.cancelOrder(order.id)
					.send({from: account})
					.on('transactionHash', (hash) => {
						dispatch(orderCancelling())
						return true
					}).catch((error) =>{
						console.log("There was an error in cancelling the order.")
						return false
					})
	
}
export const fillOrder = async (exchange, order, account, dispatch) => {
	await exchange.methods.fillOrder(order.id)
					.send({from: account})
					.on('transactionHash', (hash) => {
						dispatch(orderFilling())
						return true
					}).catch((error) =>{
						console.log("There was an error in filling the order.")
						return false
					})
}

export const loadBalances = async(web3, exchange, token, account, dispatch) => {
	if (account !== ''){
		const ethBalance = await web3.eth.getBalance(account)
		dispatch(ethBalanceLoaded(ethBalance))

		const tokenBalance = await token.methods.balanceOf(account).call()
		dispatch(tokenBalanceLoaded(tokenBalance))

		const exchangeEthBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call()
		dispatch(exchangeEthBalanceLoaded(exchangeEthBalance))

		const exchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call()
		dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance))
	}else{
		dispatch(ethBalanceLoaded(0))
		dispatch(tokenBalanceLoaded(0))
		dispatch(exchangeEthBalanceLoaded(0))
		dispatch(exchangeTokenBalanceLoaded(0))
	}
	dispatch(balancesLoaded())
	
}

export const depositEth = async(exchange, web3, ethDepositAmount, account, dispatch) =>{
	if (account !== '' && ethDepositAmount !== null){
		const ethAmount = web3.utils.toWei(ethDepositAmount.toString(), 'ether')
		await exchange.methods.depositEther()
								.send({from: account, value: ethAmount})
								.on('transactionHash', (hash) =>{
									dispatch(balancesLoading())
								}).on('error', (error)=>{
									console.log(error)
									window.alert("Could not deposit Eth. Try again.")
								})
	}
}
export const withdrawEth = async(exchange, web3, ethWithdrawAmount, account, dispatch) =>{
	if (account !== '' && ethWithdrawAmount !== null){
		const ethAmount = web3.utils.toWei(ethWithdrawAmount.toString(), 'ether')
		await exchange.methods.withdrawEther(ethAmount)
								.send({from: account})
								.on('transactionHash', (hash) =>{
									dispatch(balancesLoading())
								}).on('error', (error)=>{
									console.log(error)
									window.alert("Could not withdraw Eth. Try again.")
								})
	}
}

export const depositToken = async(exchange, web3, tokenDepositAmount, account, token, dispatch) =>{
	if (account !== '' && tokenDepositAmount !== null){
		const tokenAmount = web3.utils.toWei(tokenDepositAmount.toString(), 'ether')

		await token.methods.approve(exchange.options.address, tokenAmount)
							.send({from: account})
							.on('transactionHash', async (hash) => {
								await exchange.methods.depositToken(token.options.address, tokenAmount)
								.send({from: account})
								.on('transactionHash', (hash) =>{
									dispatch(balancesLoading())
								}).on('error', (error)=>{
									console.log(error)
									window.alert("Could not deposit token. Try again.")
								})
							}).on('error', (error) => {
								window.alert("User cancelled. Try again.")
							})
	}
}
export const withdrawToken = async(exchange, web3, tokenWithdrawAmount, account, token, dispatch) =>{
	if (account !== '' && tokenWithdrawAmount !== null){
		const tokenAmount = web3.utils.toWei(tokenWithdrawAmount.toString(), 'ether')
		await exchange.methods.withdrawToken(token.options.address, tokenAmount)
								.send({from: account})
								.on('transactionHash', (hash) =>{
									dispatch(balancesLoading())
								}).on('error', (error)=>{
									console.log(error)
									window.alert("Could not withdraw token. Try again.")
								})
	}
}

export const makeBuyOrder = async (exchange, token, web3, order, account, dispatch) => {
	try{
		if (account !== '' && order !== null){
		const tokenGet = token.options.address
		const amountGet = web3.utils.toWei(order.amount.toString(), 'ether')
		const tokenGive = ETHER_ADDRESS

		const precision = 10**18
		const ordering = Math.round(order.amount * order.price * precision)/ precision
		const amountGive = web3.utils.toWei(ordering.toString(), 'ether')

		await exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive)
								.send({from: account})
								.on('transactionHash', (hash) =>{
									dispatch(buyOrderMaking())
								}).on('error', (error) =>{
									console.log(error)
									// window.alert("Could not make buy order. Try again.")
								})
		}
	}catch(err){
		console.log(err)
	}
	
	
}
export const makeSellOrder = async (exchange, token, web3, order, account, dispatch) => {
	try{
		if (account !== '' && order !== null){
		const tokenGet = ETHER_ADDRESS

		const precision = 10**18
		const ordering = Math.round(order.amount * order.price * precision)/ precision
		const amountGet = web3.utils.toWei(ordering.toString(), 'ether')

		const tokenGive = token.options.address
		const amountGive = web3.utils.toWei(order.amount.toString(), 'ether')

		await exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive)
								.send({from: account})
								.on('transactionHash', (hash) =>{
									dispatch(sellOrderMaking())
								}).on('error', (error) =>{
									console.log(error)
									// window.alert("Could not make sell order. Try again.")
								})
		}
	}catch(err){
		console.log(err)
	}
	
}

// smart contract event listener
export const subscribeToEvents = async(exchange, dispatch)=>{
	await exchange.events.Cancel({}, (error, event) =>{
		dispatch(orderCancelled(event.returnValues))
	})
	await exchange.events.Trade({}, (error, event) => {
		dispatch(orderFilled(event.returnValues))
	})
	await exchange.events.Deposit({}, (error, event) =>{
		dispatch(balancesLoaded())
	})
	await exchange.events.Withdraw({}, (error, event) =>{
		dispatch(balancesLoaded())
	})
	await exchange.events.Order({}, (error, event) =>{
		dispatch(orderMade(event.returnValues))
	})
}














