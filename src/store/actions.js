export function web3Loaded(connection){
	return{
		type: 'WEB3_LOADED',
		connection: connection
	}
}

export function web3AccountLoaded(account){
	return {
		type: 'WEB3_ACCOUNT_LOADED',
		account
	}
}

export function tokenLoaded(contract){
	return {
		type: 'TOKEN_LOADED',
		contract
	}
}

export function exchangeLoaded(contract){
	return {
		type: 'EXCHANGE_LOADED',
		contract
	}
}

// orders: cancelled, filled, all
export function cancelledOrdersLoaded(orders){
	return {
		type: 'CANCELLED_ORDERS_LOADED',
		cancelledOrders: orders
	}
}

export function filledOrdersLoaded(orders){
	return{
		type: 'FILLED_ORDERS_LOADED',
		filledOrders: orders
	}
}
export function allOrdersLoaded(orders){
	return{
		type: 'ALL_ORDERS_LOADED',
		allOrders: orders
	}
}
export function orderCancelling(){
	return{
		type: 'ORDER_CANCELLING'
	}
}

export function orderCancelled(order){
	return{
		type: 'ORDER_CANCELLED',
		cancelledOrder: order
	}
}

export function orderFilling(order){
	return{
		type: 'ORDER_FILLING'
	}
}
export function orderFilled(order){
	return{
		type: 'ORDER_FILLED',
		filledOrder: order
	}
}

// eth and token balances
export function ethBalanceLoaded(balance){
	return{
		type: 'ETH_BALANCE_LOADED',
		balance
	}
}

export function tokenBalanceLoaded(balance){
	return{
		type: 'TOKEN_BALANCE_LOADED',
		balance
	}
}
export function exchangeEthBalanceLoaded(balance){
	return{
		type: 'EXCHANGE_ETH_BALANCE_LOADED',
		balance
	}
}
export function exchangeTokenBalanceLoaded(balance){
	return{
		type: 'EXCHANGE_TOKEN_BALANCE_LOADED',
		balance
	}
}

export function balancesLoaded(){
	return{
		type: 'BALANCES_LOADED'
	}
}
export function balancesLoading(){
	return{
		type: 'BALANCES_LOADING'
	}
}

// deposit and withdrawals for eth and token
export function ethDepositAmountChanged(amount){
	return {
		type: 'ETH_DEPOSIT_AMOUNT_CHANGED',
		amount
	}
}
export function ethWithdrawAmountChanged(amount){
	return {
		type: 'ETH_WITHDRAW_AMOUNT_CHANGED',
		amount
	}
}

export function tokenDepositAmountChanged(amount){
	return {
		type: 'TOKEN_DEPOSIT_AMOUNT_CHANGED',
		amount
	}
}

export function tokenWithdrawAmountChanged(amount){
	return {
		type: 'TOKEN_WITHDRAW_AMOUNT_CHANGED',
		amount
	}
}

// buy orders
export function buyOrderMaking(price){
	return {
		type: 'BUY_ORDER_MAKING',
		price
	}
}
export function buyOrderAmountChanged(amount){
	return {
		type: 'BUY_ORDER_AMOUNT_CHANGED',
		amount
	}
}
export function buyOrderPriceChanged(price){
	return {
		type: 'BUY_ORDER_PRICE_CHANGED',
		price
	}
}
//sell orders
export function sellOrderAmountChanged(amount){
	return {
		type: 'SELL_ORDER_AMOUNT_CHANGED',
		amount
	}
}
export function sellOrderPriceChanged(price){
	return {
		type: 'SELL_ORDER_PRICE_CHANGED',
		price
	}
}

export function sellOrderMaking(price){
	return {
		type: 'SELL_ORDER_MAKING',
		price
	}
}
//order made
export function orderMade(order){
	return {
		type: 'ORDER_MADE',
		order
	}
}








