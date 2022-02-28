import Web3 from 'web3'
import {
	web3Loaded,
	web3AccountLoaded,
	tokenLoaded,
	exchangeLoaded,
	cancelledOrdersLoaded,
	filledOrdersLoaded,
	allOrdersLoaded
} from './actions'

import Exchange from '../abis/Exchange.json'
import PoiToken from '../abis/PoiToken.json'

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








