// import {tokens, EVM_REVERT} from './helpers'
const {tokens, EVM_REVERT, ETHER_ADDRESS, ether} = require('./helpers')

const Exchange = artifacts.require("./Exchange")
const PoiToken = artifacts.require("./PoiToken")

require('chai').use(require('chai-as-promised')).should()


contract('Exchange', ([deployer, feeAccount, user1, user2]) => {
	let exchange
	let poitoken
	const feePercent = 10

	beforeEach(async()=>{
		poitoken = await PoiToken.new()
		exchange = await Exchange.new()
		await exchange.initialize(feeAccount, feePercent)
		poitoken.transfer(user1, tokens(100), {from: deployer})
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

	describe('fallback', () => {
		it('reverts when ether is improperly sent', async() =>{
			await exchange.sendTransaction({value: 1, from: user1}).should.be.rejectedWith(EVM_REVERT)
		})
	})

	describe('depositing ether', () => {
		let result
		let amount

		beforeEach(async () => {
			amount = ether(1)
			result = await exchange.depositEther({from: user1, value: amount})
		})
		it('tracks ether deposits', async () =>{
			const balance = await exchange.tokens(ETHER_ADDRESS, user1)
			balance.toString().should.equal(amount.toString())
		})
		it('Emits a deposit event for ether deposits', async() => {
				const log = result.logs[0]
				log.event.should.equal('Deposit')
				const event = log.args
				event.token.should.equal(ETHER_ADDRESS, 'token address is correct')
				event.user.should.equal(user1, 'user address is correct')
				event.amount.toString().should.equal(ether(1).toString(), 'amount is correct')
				event.balance.toString().should.equal(ether(1).toString(), 'balance is correct')
		})
	})
	describe('withdrawing ether', () => {
		let result
		let amount

		beforeEach(async () => {
			amount = ether(1)
			result = await exchange.depositEther({from: user1, value: amount})
		})
		describe('success', async() => {
			beforeEach(async()=>{
				result = await exchange.withdrawEther(amount, {from: user1})
			})
			it('withdraws ether funds', async() =>{
				const balance = await exchange.tokens(ETHER_ADDRESS, user1)
				balance.toString().should.equal('0')
			})
			it('Emits a withdraw event', async() => {
				const log = result.logs[0]
				log.event.should.equal('Withdraw')
				const event = log.args
				event.token.should.equal(ETHER_ADDRESS, 'token address is correct')
				event.user.should.equal(user1, 'user address is correct')
				event.amount.toString().should.equal(amount.toString(), 'amount is correct')
				event.balance.toString().should.equal('0', 'balance is correct')
			})
		})
		describe('failure', async() => {
			it('rejects withdraws for insufficient balances', async() =>{
				await exchange.withdrawEther(ether(100), {from: user1}).should.be.rejectedWith(EVM_REVERT)
			})
		})
	})

	describe('depositing tokens', () => {
		let result 
		let amount 
		
		describe('success', () => {

			beforeEach(async() => {
				amount = tokens(10)
				await poitoken.approve(exchange.address, amount, {from: user1})
				result = await exchange.depositToken(poitoken.address, amount, {from: user1})
			})

			it('tracks the token deposit', async () => {
				let balance = await poitoken.balanceOf(exchange.address)
				balance.toString().should.equal(amount.toString())
				balance = await exchange.tokens(poitoken.address, user1)
				balance.toString().should.equal(amount.toString())
			})

			it('Emits a deposit event', async() => {
				const log = result.logs[0]
				log.event.should.equal('Deposit')
				const event = log.args
				event.token.should.equal(poitoken.address, 'token address is correct')
				event.user.should.equal(user1, 'user address is correct')
				event.amount.toString().should.equal(tokens(10).toString(), 'amount is correct')
				event.balance.toString().should.equal(tokens(10).toString(), 'balance is correct')
			})
		})
		describe('failure', () => {
			it('rejects ether deposits', async() => {
				await exchange.depositToken(ETHER_ADDRESS, tokens(10), {from: user1}).should.be.rejected
			})
			it('fail when no tokens are approved', async () => {
				await exchange.depositToken(poitoken.address, amount, {from: user1}).should.be.rejectedWith(EVM_REVERT)
			})
		})

	})

	describe('withdrawing tokens', () => {
		let result 
		let amount 

		beforeEach(async() => {
			amount = tokens(10)
			await poitoken.approve(exchange.address, amount, {from: user1})
			result = await exchange.depositToken(poitoken.address, amount, {from: user1})
		})

		describe('success', () => {

			beforeEach(async() => {
				result = await exchange.withdrawToken(poitoken.address, amount, {from: user1})
			})

			it('tracks the token withdrawal', async () => {
				let balance = await poitoken.balanceOf(exchange.address)
				balance.toString().should.equal('0')
				balance = await exchange.tokens(poitoken.address, user1)
				balance.toString().should.equal('0')
			})

			it('check token balance of user', async() => {
				let balance = await poitoken.balanceOf(user1)
				balance.toString().should.equal(tokens(100).toString())
			})
			it('Emits a withdraw event', async() => {
				const log = result.logs[0]
				log.event.should.equal('Withdraw')
				const event = log.args
				event.token.should.equal(poitoken.address, 'token address is correct')
				event.user.should.equal(user1, 'user address is correct')
				event.amount.toString().should.equal(amount.toString(), 'amount is correct')
				event.balance.toString().should.equal('0', 'balance is correct')
			})
		})
		describe('failure', () => {
			it('reject ether withdraws', async () =>{
				await exchange.withdrawToken(ETHER_ADDRESS, tokens(10), {from: user1}).should.be.rejectedWith(EVM_REVERT)
			})
			it('fails for insufficient balance', async() => {
				await exchange.withdrawToken(poitoken.address, tokens(100), {from: user1}).should.be.rejectedWith(EVM_REVERT)
			})
		})

	})
	describe('balance checking', async () =>{
		beforeEach(async() => {
			await exchange.depositEther({from: user1, value: ether(1)})
		})
		it('returns user balance', async() => {
			const result = await exchange.balanceOf(ETHER_ADDRESS, user1)
			result.toString().should.equal(ether(1).toString())
		})
	})

	describe('Making order', async() => {
		let result

		beforeEach(async () => {
			result = await exchange.makeOrder(poitoken.address, tokens(1), ETHER_ADDRESS, ether(1), {from: user1})
		})
		it('tracks the newly created order', async() => {
			const orderCount = await exchange.orderCount()
			orderCount.toString().should.equal('1')
		})
		it('check order struct', async() => {
			const order = await exchange.orders(1)
			order.id.toString().should.equal('1')
			order.user.should.equal(user1)
			order.tokenGet.should.equal(poitoken.address)
			order.amountGet.toString().should.equal(tokens(1).toString())
			order.tokenGive.should.equal(ETHER_ADDRESS)
			order.amountGive.toString().should.equal(ether(1).toString())
			order.timestamp.toString().length.should.be.at.least(1)
		})
		it('emit order event', async() => {
			const log = result.logs[0]
			log.event.should.eq('Order')
			const event = log.args
			event.id.toString().should.equal('1')
			event.user.should.equal(user1)
			event.tokenGet.should.equal(poitoken.address)
			event.amountGet.toString().should.equal(tokens(1).toString())
			event.tokenGive.should.equal(ETHER_ADDRESS)
			event.amountGive.toString().should.equal(ether(1).toString())
			event.timestamp.toString().length.should.be.at.least(1)
		})
	})
	describe('order actions', async() => {
		beforeEach(async() => {
			//user 1 deposits ether
			await exchange.depositEther({from: user1, value: ether(1)})

			//user 2 deposits token
			await poitoken.transfer(user2, tokens(100), {from: deployer})
			await poitoken.approve(exchange.address, tokens(2), {from: user2})
			await exchange.depositToken(poitoken.address, tokens(2), {from: user2})

			//user1 makes an order to buy tokens with ether
			await exchange.makeOrder(poitoken.address, tokens(1), ETHER_ADDRESS, ether(1), {from: user1})
		})

		describe('cancelling orders', async() => {
			let result

			describe('success', async() => {
				beforeEach(async()=>{
					result = await exchange.cancelOrder('1', {from: user1})
				})
				it('updates cancelled orders', async() => {
					const orderCancelled = await exchange.orderCancelled(1)
					orderCancelled.should.equal(true)
				})
				it('emits cancel event', async() => {
					const log = result.logs[0]
					log.event.should.eq('Cancel')
					const event = log.args
					event.id.toString().should.equal('1')
					event.user.should.equal(user1)
					event.tokenGet.should.equal(poitoken.address)
					event.amountGet.toString().should.equal(tokens(1).toString())
					event.tokenGive.should.equal(ETHER_ADDRESS)
					event.amountGive.toString().should.equal(ether(1).toString())
					event.timestamp.toString().length.should.be.at.least(1)
				})
			})
			describe('failure', async() => {
				it('rejects invalid order id', async() => {
					await exchange.cancelOrder('99999', {from: user1}).should.be.rejectedWith(EVM_REVERT)
				})
				it('invalidate illegal order cancel by another user', async() => {
					await exchange.cancelOrder('1', {from: user2}).should.be.rejectedWith(EVM_REVERT)
				})
			})
		})

		describe('filling orders', async() => {
			let result
			describe('success', async() => {
				beforeEach(async() => {
					result = await exchange.fillOrder('1', {from: user2})
				})

				it('executes trade & charge fees', async() => {
					let balance
					balance = await exchange.balanceOf(poitoken.address, user1)
					balance.toString().should.equal(tokens(1).toString(), 'user1 received tokens')

					balance = await exchange.balanceOf(ETHER_ADDRESS, user2)
					balance.toString().should.equal(ether(1).toString(), 'user2 received ether')

					balance = await exchange.balanceOf(ETHER_ADDRESS, user1)
					balance.toString().should.equal('0', 'user1 has no ether now')

					balance = await exchange.balanceOf(poitoken.address, user2)
					balance.toString().should.equal(tokens(0.9).toString())

					balance = await exchange.balanceOf(poitoken.address, feeAccount)
					balance.toString().should.equal(tokens(0.1).toString())
				})

				it('emit trade event', async() => {
					const log = result.logs[0]
					log.event.should.eq('Trade')
					const event = log.args
					event.id.toString().should.equal('1')
					event.user.should.equal(user1)
					event.tokenGet.should.equal(poitoken.address)
					event.amountGet.toString().should.equal(tokens(1).toString())
					event.tokenGive.should.equal(ETHER_ADDRESS)
					event.amountGive.toString().should.equal(ether(1).toString())
					event.userFill.should.equal(user2)
					event.timestamp.toString().length.should.be.at.least(1)
				})

			})
			describe('failure', async() => {
				it('reject invalid order ids', async() => {
					await exchange.fillOrder(999999, {from: user2}).should.be.rejectedWith(EVM_REVERT)
				})
				it('rejects already filled orders', async() => {
					await exchange.fillOrder(1, {from: user2})
					await exchange.fillOrder(1, {from: user2}).should.be.rejected
				})
				it('rejects canceled orders', async() => {
					await exchange.cancelOrder(1, {from: user1})
					await exchange.fillOrder(1, {from: user2}).should.be.rejected
				})
			})
		})

	})

})