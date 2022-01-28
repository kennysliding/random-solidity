const TokenWrapper = artifacts.require("TokenWrapper");
const KennyCoin = artifacts.require("KennyCoin");

contract("TokenWrapper tests", (accounts) => {
  beforeEach(async () => {
    tokenWrapper = await TokenWrapper.deployed();
  });
});
