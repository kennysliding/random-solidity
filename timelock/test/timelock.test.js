const TimeCoin = artifacts.require("./TimeCoin.sol");
const Timelocker = artifacts.require("./Timelocker.sol");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

contract("Timelocker", (accounts) => {
  it("should put 10000 timecoin in the first account", async () => {
    const timeCoin = await TimeCoin.deployed();
    const balance = await timeCoin.balanceOf(accounts[0]);
    assert.equal(balance.toNumber(), 10000);
  });

  it("try release a non-exist locker", async () => {
    const timelocker = await Timelocker.deployed();
    try {
      await timelocker.release(1, { from: accounts[0] });
      assert.fail();
    } catch (error) {
      assert.include(error.message, "Locker does not exist");
    }
  });

  it("should deposit 200 timecoin in timelocker from account 0 to account 1", async () => {
    const timeCoin = await TimeCoin.deployed();
    const timelocker = await Timelocker.deployed();
    await timeCoin.approve(timelocker.address, 200, { from: accounts[0] });
    let balance0 = await timeCoin.balanceOf(accounts[0]);
    assert.equal(balance0.toNumber(), 10000);

    let blockTime = await timelocker.getCurrentBlockTime();
    blockTime = blockTime.toNumber() + 5;
    await timelocker.deposit(accounts[1], blockTime, 200, {
      from: accounts[0],
    });
    balance0 = await timeCoin.balanceOf(accounts[0]);
    assert.equal(balance0.toNumber(), 9800);

    try {
      await timelocker.release(0, { from: accounts[1] });
      assert.fail();
    } catch (error) {
      assert.include(error.message, "Not yet can release");
    }

    await sleep(8000);
    await timelocker.release(0, { from: accounts[1] });
    const balance1 = await timeCoin.balanceOf(accounts[1]);
    assert.equal(balance1.toNumber(), 200);

    try {
      await timelocker.release(0, { from: accounts[1] });
      assert.fail();
    } catch (error) {
      assert.include(error.message, "Already been released");
    }
  });
});
