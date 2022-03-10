const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const PoiToken  = artifacts.require("PoiToken")

const Exchange = artifacts.require("Exchange")
// const Exchange2 = artifacts.require("Exchange2")


module.exports = async (deployer) => {
  const feePercent = 10

  const accounts = await web3.eth.getAccounts()
  await deployer.deploy(PoiToken)

  const feeAccount = accounts[0]
  // const feeAccount = '0x634899A96190Dc4597cfFC7CE42DB0ffBd85f11c'
  await deployProxy(Exchange, [feeAccount, feePercent], {deployer, initializer: 'initialize'})

  // const existing = await Exchange.deployed();
  // const instance = await upgradeProxy(existing.address, Exchange2, { deployer });
};

// module.exports = async (deployer) => {
//   const feePercent = 10

//   const accounts = await web3.eth.getAccounts()
//   await deployer.deploy(PoiToken)

//   const feeAccount = accounts[0]
//   await deployer.deploy(Exchange, feeAccount, feePercent)
// };