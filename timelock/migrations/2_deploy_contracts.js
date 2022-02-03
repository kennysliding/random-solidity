var TimeCoin = artifacts.require("TimeCoin");
var Timelocker = artifacts.require("Timelocker");

module.exports = async function (deployer) {
  await deployer.deploy(TimeCoin);
  const timeCoin = await TimeCoin.deployed();
  await deployer.deploy(Timelocker, timeCoin.address);
};
