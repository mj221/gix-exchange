const PoiToke  = artifacts.require("PoiToken");

module.exports = function (deployer) {
  deployer.deploy(PoiToken);
};
