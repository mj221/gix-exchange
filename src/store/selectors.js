import {get} from 'lodash' // deal with errors; prevents breaking
import moment from 'moment'
import {createSelector} from 'reselect' //from redux

import {
	ETHER_ADDRESS, 
	tokens, ether,
	RED, GREEN
} from '../helpers'


// const account = state => state.web3.account
// export const accountSelector = createSelector(account, account => account)
// export const accountSelector = createSelector(account, (account) => {account})
const account = state => get(state, 'web3.account', '')
export const accountSelector = createSelector(account, a => a)
//

/// Check if necessary contracts are loaded
const tokenLoaded = state => get(state, 'token.loaded', false)  //default value false
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl)

const exchangeLoaded = state => get(state, 'exchange.loaded', false)
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el)

// const contractLoaded = state => tokenLoaded(state) && exchangeLoaded(state)
// export const contractLoadedSelector = createSelector(contractLoaded, cl => cl)
export const contractLoadedSelector = createSelector(
	tokenLoaded,
	exchangeLoaded,
	(tl, el) => (tl && el)
)

const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e => e)

const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false)
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, fol => fol)

const filledOrders = state => get(state, 'exchange.filledOrders.data', [])
export const filledOrdersSelector = createSelector(
	filledOrders,
	orders => {
		// sort order from earliest to latest to compare prices
		orders = orders.sort((a,b) => a.timestamp - b.timestamp)

		orders = decorateFilledOrders(orders)

		// sorting orders from latest to earliest trades for user display
		orders = orders.sort((a,b) => b.timestamp - a.timestamp)
		return orders
	}
)

const decorateFilledOrders = (orders) => {
	let previousOrder = orders[0]
	console.log("NEED TO KNOW:", orders[0])
	return (
		orders.map((order) => {
			order = decorateOrder(order)

			// Compare price between currnet order and previous order
			order = decorateFilledOrder(order, previousOrder)
			previousOrder = order
			return order
		})
	)
}

const decorateOrder = order =>{
	let tokenAmount, etherAmount

	if(order.tokenGive.toString() === ETHER_ADDRESS){
		etherAmount = order.amountGive
		tokenAmount = order.amountGet
	}else{
		etherAmount = order.amountGet
		tokenAmount = order.amountGive
	}

	// calculate price: ether/token
	let tokenPrice = (etherAmount / tokenAmount)
	const precision = 10 ** 5
	tokenPrice = Math.round(tokenPrice * precision) / precision

	return ({
		...order,
		etherAmount: ether(etherAmount),
		tokenAmount: tokens(tokenAmount),
		tokenPrice,
		formattedTimeStamp: moment.unix(order.timestamp).format('kk:mm:ss D/M/YY')
	})
}

const decorateFilledOrder = (order, previousOrder) => {
	return({
		...order,
		tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder)
	})
}

const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
	// Price comparison function
	// Display in CSS green if order price > previous order
	// Reversely, display CSS red if order price < previous order
	if (previousOrder.id === orderId){
		return GREEN
	}
	if (previousOrder.tokenPrice <= tokenPrice){
		return GREEN
	}else{
		return RED
	}
}







