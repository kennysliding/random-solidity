var KennyCoin = artifacts.require("KennyCoin");
var TokenWrapper = artifacts.require("TokenWrapper");

module.exports = function (deployer) {
  deployer.deploy(KennyCoin, 10000);
  deployer.deploy(TokenWrapper);
};
