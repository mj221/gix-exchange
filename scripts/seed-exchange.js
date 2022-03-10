const PoiToken  = artifacts.require("PoiToken");
const Exchange = artifacts.require("Exchange")

const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:7545');

const tokens = (n) => {
  return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'))
}
const ether = (amount) => tokens(amount)

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000"

const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// seeding exchange
module.exports = async function(callback) {
  
  try{
    const accounts = await web3.eth.getAccounts()

    const poitoken = await PoiToken.deployed()
    const exchange = await Exchange.deployed()

    const sender = accounts[0]
    const receiver = accounts[1]

    let amount = web3.utils.toWei('10000', 'ether')

    await poitoken.transfer(receiver, amount, {from: sender})
    console.log(`Transferred ${amount} tokens from ${sender} to ${receiver}`)

    const user1 = accounts[0]
    const user2 = accounts[1]

    /// Deposit ether and tokens
    amount = 1
    await exchange.depositEther({from: user1, value: ether(amount)})
    console.log(`Deposited ${amount} Ether from ${user1}`)

    amount = 10000
    await poitoken.approve(exchange.address, tokens(amount), {from: user2})
    console.log(`Approved ${amount} tokens from ${user2}`)

    await exchange.depositToken(poitoken.address, tokens(amount), {from: user2})
    console.log(`Deposited ${amount} tokens from ${user2}`)

    /// Seed cancel order

    let result
    let orderId
    result = await exchange.makeOrder(poitoken.address, tokens(100), ETHER_ADDRESS, ether(0.1), {from: user1})
    console.log(`Made order from ${user1}`)


    orderId = result.logs[0].args.id
    await exchange.cancelOrder(orderId, {from: user1})
    console.log(`Cancelled order from ${user1}`)

    /// Seed Filled orders
    result = await exchange.makeOrder(poitoken.address, tokens(100), ETHER_ADDRESS, ether(0.1), {from: user1})
    console.log(`Made order from ${user1}`)

    orderId = result.logs[0].args.id
    await exchange.fillOrder(orderId, {from: user2})
    console.log(`Filled order from ${user1}`)

    await wait(1)

    result = await exchange.makeOrder(poitoken.address, tokens(50), ETHER_ADDRESS, ether(0.01), {from: user1})
    console.log(`Made order from ${user1}`)

    orderId = result.logs[0].args.id
    await exchange.fillOrder(orderId, {from: user2})
    console.log(`Filled order from ${user1}`)

    await wait(1)

    result = await exchange.makeOrder(poitoken.address, tokens(200), ETHER_ADDRESS, ether(0.15), {from: user1})
    console.log(`Made order from ${user1}`)

    orderId = result.logs[0].args.id
    await exchange.fillOrder(orderId, {from: user2})
    console.log(`Filled order from ${user1}`)

    await wait(1)


    /// seed open orders
    for (let i = 1; i <= 10; i++) {
      result = await exchange.makeOrder(poitoken.address, tokens(10*i), ETHER_ADDRESS, ether(0.01), {from: user1})
      console.log(`Made order from ${user1}`)

      await wait(1)
    }
    for (let i = 1; i <= 10; i++) {
      result = await exchange.makeOrder(ETHER_ADDRESS, ether(0.01), poitoken.address, tokens(10*i), {from: user2})
      console.log(`Made order from ${user2}`)

      await wait(1)
    }

  }catch(error){
    console.log(error)
  }

  callback()
};


// truffle exec scripts/seed-exchange.js