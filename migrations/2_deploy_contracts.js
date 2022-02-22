const PoiToken  = artifacts.require("PoiToken");
const Exchange = artifacts.require("Exchange")

module.exports = async (deployer, network, accounts) => {
  const feePercent = 10;
  await deployer.deploy(PoiToken);
  await deployer.deploy(Exchange, accounts[1], feePercent);
};
