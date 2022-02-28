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
