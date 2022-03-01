const web3 = require('web3')

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

export const tokens = n => web3.utils.fromWei(n, 'ether')

export const ether = n => tokens(n)

export const RED = 'danger'
export const GREEN = 'success'

export const addressIsEqual = (address1, address2) =>{
	return web3.utils.toChecksumAddress(address1) === web3.utils.toChecksumAddress(address2)
}