const PoiToken  = artifacts.require("PoiToken");
const Exchange = artifacts.require("Exchange")

module.exports = async (deployer) => {
  const feePercent = 10

  const accounts = await web3.eth.getAccounts()
  await deployer.deploy(PoiToken)

  const feeAccount = accounts[0]
  await deployer.deploy(Exchange, feeAccount, feePercent)
};
