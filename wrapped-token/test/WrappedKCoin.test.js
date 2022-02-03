const KCoin = artifacts.require("KCoin");
const WrappedKCoin = artifacts.require("WrappedKCoin");

contract("WrappedKCoin", (accounts) => {
  // approve the contract
  it("should put 10000 KCoin in the first account", async () => {
    const kcoin = await KCoin.deployed();
    const balance = await kcoin.balanceOf(accounts[0]);
    assert.equal(balance.toNumber(), 10000);
  });

  it("should approve 100 kcoin from the first account in wrappedkcoin", async () => {
    const kcoin = await KCoin.deployed();
    const wrappedkcoin = await WrappedKCoin.deployed();
    await kcoin.approve(wrappedkcoin.address, 100, { from: accounts[0] });
    const allowance = await kcoin.allowance(accounts[0], wrappedkcoin.address);
    assert.equal(allowance.toNumber(), 100);
  });

  it("should wrap 100 kcoin from the first account and receive 50 wrappedkcoin", async () => {
    const kcoin = await KCoin.deployed();
    const wrappedkcoin = await WrappedKCoin.deployed();
    await kcoin.approve(wrappedkcoin.address, 100, { from: accounts[0] });
    await wrappedkcoin.deposit(100, { from: accounts[0] });
    const balance = await wrappedkcoin.balanceOf(accounts[0]);
    assert.equal(balance.toNumber(), 50);
  });

  it("should wrap 100 kcoin from the first account and receive 50 wrappedkcoin and unwrap to receive 100 kcoin", async () => {
    const kcoin = await KCoin.deployed();
    const wrappedkcoin = await WrappedKCoin.deployed();
    await kcoin.approve(wrappedkcoin.address, 100, { from: accounts[0] });
    await wrappedkcoin.deposit(100, { from: accounts[0] });
    await wrappedkcoin.withdraw(100, { from: accounts[0] });
    const kBalance = await kcoin.balanceOf(accounts[0]);
    const wrappedKBalance = await wrappedkcoin.balanceOf(accounts[0]);
    assert.equal(kBalance.toNumber(), 10000);
    assert.equal(wrappedKBalance.toNumber(), 0);
  });
});
