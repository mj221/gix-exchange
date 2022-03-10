import {get, reject, groupBy, filter} from 'lodash'
import moment from 'moment'
import {createSelector} from 'reselect' //from redux

import {
	ETHER_ADDRESS, 
	tokens, ether,
	RED, GREEN,
	addressIsEqual,
	formatBalance
} from '../helpers'


// const account = state => state.web3.account
// export const accountSelector = createSelector(account, account => account)
// export const accountSelector = createSelector(account, (account) => {account})
const account = state => get(state, 'web3.account', '')
export const accountSelector = createSelector(account, a => {return a})

const web3 = state => get(state, 'web3.connection')
export const web3Selector = createSelector(web3, w => w)

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

const token = state => get(state, 'token.contract')
export const tokenSelector = createSelector(token, t => t)
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

		const buyOrders = get(orders, 'Buy', [])

		orders = {
			...orders,
			// greatest price to smallest
			buyOrders: buyOrders.sort((a,b) => b.tokenPrice-a.tokenPrice)
		}
		const sellOrders = get(orders, 'Sell', [])
		orders ={
			...orders,
			sellOrders: sellOrders.sort((a,b) => a.tokenPrice-b.tokenPrice)
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
	const orderType = order.tokenGive === ETHER_ADDRESS ? 'Buy' : 'Sell'
	return ({
		...order,
		orderType,
		orderTypeClass: orderTypeFillClass(orderType).type,
		orderFillAction: orderTypeFillClass(orderType).fill
	})
}
const orderTypeFillClass = orderType =>{
	if(orderType === 'Buy'){
		return {type:GREEN, fill: 'Sell'}
	}else{
		return {type: RED, fill: 'Buy'}
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
		// Buy order if userA trades(Buy) ether for token, Sell order otherwise
		orderType = order.tokenGive === ETHER_ADDRESS ? 'Buy' : 'Sell'
	}else{
		// userA filled order and trades token away for ether. Sells token.
		orderType = order.tokenGive === ETHER_ADDRESS ? 'Sell' : 'Buy'
	}

	return ({
		...order,
		orderTypeClass: orderTypeSignClass(orderType).type,
		orderSignClass: orderTypeSignClass(orderType).sign
	})
}

const orderTypeSignClass = orderType =>{
	if(orderType === 'Buy'){
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
	let orderType = order.tokenGive === ETHER_ADDRESS? 'Buy' : 'Sell'

	return ({
		...order,
		formattedTimeStamp: moment.unix(order.timestamp).format('kk:mm:ss D/M/YY'),
		orderType,
		orderTypeClass: orderTypeSignClass(orderType).type
	})
}
////// MY ORDER HISTORY
const allUserOrders = state => {
	const all = allOrders(state)
	const filled = filledOrders(state)
	const cancelled = cancelledOrders(state)

	const allUserOrders = filter(all, (order) => {
		const orderFilled = filled.some((o) => o.id === order.id)
		const orderCancelled = cancelled.some((o) => o.id === order.id)
		return (orderFilled || orderCancelled)
	})
	return allUserOrders
}

export const myOrderHistoryLoadedSelector = createSelector(orderBookLoaded, loaded => loaded)
export const myOrderHistorySelector = createSelector(
	account,
	allUserOrders,
	filledOrders,
	(account, orders, filledorders) =>{
		orders = orders.filter((o) => addressIsEqual(o.user, account))
		orders = orders.sort((a,b) => b.timestamp - a.timestamp)
		orders = decorateMyAllOrders(orders, account, filledorders)

		return orders
	}
)
const decorateMyAllOrders = (orders, account, filledOrders) =>{
	return (
		orders.map((order) => {
			order = decorateOrder(order)
			order = decorateMyAllOrder(order, account, filledOrders)
			return order
		})
	)
}
const decorateMyAllOrder = (order, account, filledOrders) =>{
	const orderStatus = filledOrders.some((o) => o.id === order.id) ? 'Filled' : 'Cancelled'
	let orderType = order.tokenGive === ETHER_ADDRESS? 'Buy' : 'Sell'
	return({
		...order,
		orderStatus,
		orderType,
		orderTypeClass: orderTypeSignClass(orderType).type
	})
}



//////// CREATING PRICE CHARTS
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

// Lightweight chart ver.
const buildGraphData = orders =>{
	// group by trades made in the same minute or hour depending on startOf()
	// format('X') formats time in unix timestamp
	const order = groupBy(orders, (o) => moment.unix(o.timestamp)
												.startOf('hour')
												.format("X"))

	//
	const times = Object.keys(order)
	const graphData = times.map((time) => {
		// get each times
		const group = order[time]
		const open = group[0].tokenPrice //first order
		const close = group[group.length - 1].tokenPrice //last order

		const prices = group.map(o => o.tokenPrice)
		const high = Math.max(...prices)
		const low = Math.min(...prices)
		
		return ({
			time: parseInt(time), // must convert time to integer as json tries to pass as string
			open,
			high,
			low,
			close
		})
	})
	return graphData
}
//////
const orderCancelling = state => get(state, 'exchange.orderCancelling', false)
export const orderCancellingSelector = createSelector(orderCancelling, status => status)

const orderFilling= state => get(state, 'exchange.orderFilling', false)
export const orderFillingSelector = createSelector(orderFilling, status => status)

//////
const balancesLoading = state => get(state, 'exchange.balancesLoading', true)
export const balancesLoadingSelector = createSelector(balancesLoading, loading => loading)

const ethBalance = state => get(state, 'web3.balance', 0)
export const ethBalanceSelector = createSelector(
	ethBalance,
	(balance) =>{
		return formatBalance(balance.toString())
	}
)

const tokenBalance = state => get(state, 'token.balance', 0)
export const tokenBalanceSelector = createSelector(
	tokenBalance,
	balance =>{
		return formatBalance(balance.toString())
	}
)

const exchangeEthBalance = state => get(state, 'exchange.ethBalance', 0)
export const exchangeEthBalanceSelector = createSelector(
	exchangeEthBalance,
	balance =>{
		return formatBalance(balance.toString())
	}
)

const exchangeTokenBalance = state => get(state, 'exchange.tokenBalance', 0)
export const exchangeTokenBalanceSelector = createSelector(
	exchangeTokenBalance,
	balance =>{
		return formatBalance(balance.toString())
	}
)

const ethDepositAmount = state => get(state, 'exchange.ethDepositAmount', null)
export const ethDepositAmountSelector = createSelector(ethDepositAmount, amount=>amount)

const ethWithdrawAmount = state => get(state, 'exchange.ethWithdrawAmount', null)
export const ethWithdrawAmountSelector = createSelector(ethWithdrawAmount, amount=>amount)

const tokenDepositAmount = state => get(state, 'exchange.tokenDepositAmount', null)
export const tokenDepositAmountSelector = createSelector(tokenDepositAmount, amount=>amount)

const tokenWithdrawAmount = state => get(state, 'exchange.tokenWithdrawAmount', null)
export const tokenWithdrawAmountSelector = createSelector(tokenWithdrawAmount, amount=>amount)


// Buy order and Sell orders
const buyOrderMaking = state => get(state, 'exchange.buyOrder.making', false)
export const buyOrderMakingSelector = createSelector(buyOrderMaking, making => making)

const sellOrderMaking = state => get(state, 'exchange.sellOrder.making', false)
export const sellOrderMakingSelector = createSelector(sellOrderMaking, making => making)

const buyOrder = state => get(state, 'exchange.buyOrder', null)
export const buyOrderSelector = createSelector(buyOrder, bo => bo)

const sellOrder = state => get(state, 'exchange.sellOrder', null)
export const sellOrderSelector = createSelector(sellOrder, so => so)

const buyOrderAmount = state => get(state, 'exchange.buyOrder.amount', 0)
export const buyOrderAmountSelector = createSelector(buyOrderAmount, b => b)

const buyOrderPrice = state => get(state, 'exchange.buyOrder.price', 0)
export const buyOrderPriceSelector = createSelector(buyOrderPrice, b => b)

const sellOrderAmount = state => get(state, 'exchange.sellOrder.amount', 0)
export const sellOrderAmountSelector = createSelector(sellOrderAmount, s => s)

const sellOrderPrice = state => get(state, 'exchange.sellOrder.price', 0)
export const sellOrderPriceSelector = createSelector(sellOrderPrice, s => s)

/////extra helper functions












