const web3 = require('web3')

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

export const tokens = n => web3.utils.fromWei(n, 'ether')

export const ether = n => tokens(n)

export const RED = 'danger'
export const GREEN = 'success'

export const addressIsEqual = (address, account) =>{
	if (account === ''){
		return false
	}
	return web3.utils.toChecksumAddress(address) === web3.utils.toChecksumAddress(account)
}
export const formatBalance = balance =>{
	const precision = 10 ** 5
	balance = ether(balance)
	balance = Math.round(balance * precision) / precision //2 decimal places
	return balance
}