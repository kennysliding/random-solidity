var KCoin = artifacts.require("KCoin");
var WrappedKCoin = artifacts.require("WrappedKCoin");

module.exports = async function (deployer) {
  await deployer.deploy(KCoin);
  const kcoin = await KCoin.deployed();
  await deployer.deploy(WrappedKCoin, kcoin.address);
};
