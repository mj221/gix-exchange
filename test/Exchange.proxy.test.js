const {tokens, EVM_REVERT, ETHER_ADDRESS, ether} = require('./helpers')

const Exchange = artifacts.require("./Exchange")

require('chai').use(require('chai-as-promised')).should()

const { deployProxy } = require('@openzeppelin/truffle-upgrades');

contract('Exchange (proxy)', ([deployer, feeAccount, user1, user2]) =>{
	let exchange
	const feePercent = 10

	beforeEach(async()=>{
		exchange = await deployProxy(Exchange, [feeAccount, feePercent], {initializer: 'initialize'})
	})

	describe('deployment', () => {
		it('tracks the fee account', async () => {
			const result = await exchange.feeAccount()
			result.should.equal(feeAccount)
		})
		it('tracks fee percent' , async () => {
			const result = await exchange.feePercent()
			result.toString().should.equal(feePercent.toString())
		})

	})
})