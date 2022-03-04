import {get, reject, groupBy} from 'lodash'
import moment from 'moment'
import {createSelector} from 'reselect' //from redux

import {
	ETHER_ADDRESS, 
	tokens, ether,
	RED, GREEN,
	addressIsEqual
} from '../helpers'


// const account = state => state.web3.account
// export const accountSelector = createSelector(account, account => account)
// export const accountSelector = createSelector(account, (account) => {account})
const account = state => get(state, 'web3.account', '')
export const accountSelector = createSelector(account, a => {return a})

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
/////////
const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e => e)
// 
const allOrdersLoaded = state => get(state, 'exchange.allOrders.loaded', false)
export const allOrdersLoadedSelector = createSelector(allOrdersLoaded, loaded => loaded)

const allOrders = state => get(state, 'exchange.allOrders.data', [])
export const allOrdersSelector = createSelector(allOrders, ao => ao)
// 
const cancelledOrdersLoaded = state => get(state, 'exchange.cancelledOrders.loaded', false)
export const cancelledOrdersLoadedSelector = createSelector(cancelledOrdersLoaded, loaded => loaded)

const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', [])
export const cancelledOrdersSelector = createSelector(cancelledOrders, co => co)
// 
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
		// Green if no previous order
		return GREEN
	}
	if (previousOrder.tokenPrice <= tokenPrice){
		return GREEN
	}else{
		return RED
	}
}
///////////////////////
const openOrders = state =>{
	const all = allOrders(state)
	const filled = filledOrders(state)
	const cancelled = cancelledOrders(state)

	// reject returns elements that are NOT TRUTHY
	// Filters out all filled or cancelled orders from all orders.
	const openOrders = reject(all, (order) => {
		// returns a boolean when any element in array is TRUTHY is found
		const orderFilled = filled.some((o) => o.id === order.id)
		const orderCancelled = cancelled.some((o) => o.id === order.id)
		return (orderFilled || orderCancelled)
	})
	return openOrders
}

export const orderBookLoaded = state => cancelledOrdersLoaded(state) && filledOrdersLoaded(state) && allOrdersLoaded(state)

export const orderBookSelector = createSelector(
	openOrders,
	(orders) => {

		orders = decorateOrderBookOrders(orders)

		orders = groupBy(orders, 'orderType')

		const buyOrders = get(orders, 'buy', [])

		orders = {
			...orders,
			// greatest price to smallest
			buyOrders: buyOrders.sort((a,b) => b.tokenPrice-a.tokenPrice)
		}
		const sellOrders = get(orders, 'sell', [])
		orders ={
			...orders,
			sellOrders: sellOrders.sort((a,b) => b.tokenPrice-a.tokenPrice)
		}
		return orders
	}
)
const decorateOrderBookOrders = orders =>{
	return(
		orders.map((order) =>{
			order = decorateOrder(order)
			order = decorateOrderBookOrder(order)
			return(order)
		})
	)
}
const decorateOrderBookOrder = (order) =>{
	const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
	return ({
		...order,
		orderType,
		orderTypeClass: orderTypeFillClass(orderType).type,
		orderFillClass: orderTypeFillClass(orderType).fill
	})
}
const orderTypeFillClass = orderType =>{
	if(orderType === 'buy'){
		return {type:GREEN, fill: 'sell'}
	}else{
		return {type: RED, fill: 'buy'}
	}
}
///////////////////////////
export const myFilledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)

export const myFilledOrdersSelector = createSelector(
	account,
	filledOrders,
	(account, orders) => {
		// filter out user's conducted filled orders/trades
		orders = orders.filter((o) => addressIsEqual(o.user, account) || addressIsEqual(o.userFill, account))
		//ascending
		orders = orders.sort((a,b) => a.timestamp - b.timestamp)
		orders = decorateMyFilledOrders(orders, account)
		return orders
	}
)

const decorateMyFilledOrders = (orders, account) => {
	return (
		orders.map((order) => {
			order = decorateOrder(order)
			order = decorateMyFilledOrder(order, account)
			return order
		})
	)
}

const decorateMyFilledOrder = (order, account) =>{
	const isMyOrder = addressIsEqual(order.user, account)

	let orderType
	if(isMyOrder){
		// buy order if userA trades(buy) ether for token, sell order otherwise
		orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
	}else{
		// userA filled order and trades token away for ether. Sells token.
		orderType = order.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy'
	}

	return ({
		...order,
		orderTypeClass: orderTypeSignClass(orderType).type,
		orderSignClass: orderTypeSignClass(orderType).sign
	})
}

const orderTypeSignClass = orderType =>{
	if(orderType === 'buy'){
		return {type:GREEN, sign: '+'}
	}else{
		return {type: RED, sign: '-'}
	}
}

export const myOpenOrdersLoadedSelector = createSelector(orderBookLoaded, loaded => loaded)
export const myOpenOrdersSelector = createSelector(
	account,
	openOrders,
	(account, orders) => {
		orders = orders.filter((o) => addressIsEqual(o.user, account))
		// descending by date
		orders = orders.sort((a,b) => b.timestamp - a.timestamp)
		orders = decorateMyOpenOrders(orders, account)

		return orders
	}
)
const decorateMyOpenOrders = (orders, account) => {
	return (
		orders.map((order) => {
			order = decorateOrder(order)
			order = decorateMyOpenOrder(order, account)
			return order
		})
	)
}

const decorateMyOpenOrder = (order,account) =>{
	let orderType = order.tokenGive === ETHER_ADDRESS? 'buy' : 'sell'

	return ({
		...order,
		orderType,
		orderTypeClass: orderTypeSignClass(orderType).type
	})
}

export const priceChartLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)
export const priceChartSelector = createSelector(
	filledOrders,
	(orders) => {
		//earliest to latest
		orders = orders.sort((a,b) => a.timestamp - b.timestamp)
		orders = orders.map((o) => decorateOrder(o))
		
		let secondLastOrder, lastOrder
		[secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)

		const lastPrice = get(lastOrder, 'tokenPrice', 0)
		const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)
		return ({
			lastPrice,
			lastPriceChange: (lastPrice >= secondLastPrice) ? '+' : '-',
			series: [{
				data: buildGraphData(orders)
			}]
		})
	}
)

const buildGraphData = orders =>{
	// group by trades made in the same hour
	orders = groupBy(orders, (o) => moment.unix(o.timestamp).startOf('hour').format())

	// get all grouped hour times
	const hours = Object.keys(orders)

	const graphData = hours.map((hour) => {
		//calculate price
		const group = orders[hour]

		const open = group[0] //first order

		const close = group[group.length - 1] //last order

		const prices = group.map(o => o.tokenPrice)
		const high = Math.max(...prices)
		const low = Math.min(...prices)
		// Alternatively, could use lodash like below:
		// const high = maxBy(group, 'tokenPrice')
		// const low = minBy(group, 'tokenPrice')
		

		return ({
			x: new Date(hour),
			// [Open, High, Low, Close]
			y: [open.tokenPrice, high, low, close.tokenPrice]
		})
	})
	return graphData
}

const orderCancelling = state => get(state, 'exchange.orderCancelling', false)
export const orderCancellingSelector = createSelector(orderCancelling, status => status)










