const TimeCoin = artifacts.require("./TimeCoin.sol");
const Timelocker = artifacts.require("./Timelocker.sol");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

contract("Timelocker & TimeCoin", (accounts) => {
  describe("Initialization", () => {
    it("should put 10000 timecoin in the first account", async () => {
      const timeCoin = await TimeCoin.deployed();
      const balance = await timeCoin.balanceOf(accounts[0]);
      assert.equal(balance.toNumber(), 10000);
    });
  });

  describe("Run without error", () => {
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

      let lockers = await timelocker.getLockers({ from: accounts[1] });
      let lockerId = lockers.length - 1;
      await sleep(8000);
      await timelocker.release(lockerId, { from: accounts[1] });
      const balance1 = await timeCoin.balanceOf(accounts[1]);
      assert.equal(balance1.toNumber(), 200);
    });
  });

  describe("Run with error", () => {
    it("try release a non-exist locker", async () => {
      const timelocker = await Timelocker.deployed();
      let lockers = await timelocker.getLockers({ from: accounts[1] });
      let lockerId = lockers.length - 1;
      try {
        await timelocker.release(lockerId + 1, { from: accounts[0] });
        assert.fail();
      } catch (error) {
        assert.include(error.message, "Locker does not exist");
      }
    });

    it("try release before locker timestamp", async () => {
      const timeCoin = await TimeCoin.deployed();
      const timelocker = await Timelocker.deployed();
      await timeCoin.approve(timelocker.address, 200, { from: accounts[0] });

      let blockTime = await timelocker.getCurrentBlockTime();
      blockTime = blockTime.toNumber() + 10;
      await timelocker.deposit(accounts[1], blockTime, 200, {
        from: accounts[0],
      });
      let lockers = await timelocker.getLockers({ from: accounts[1] });
      let lockerId = lockers.length - 1;

      try {
        await timelocker.release(lockerId, { from: accounts[1] });
        assert.fail();
      } catch (error) {
        assert.include(error.message, "Not yet can release");
      }
    });

    it("try release a released locker", async () => {
      const timeCoin = await TimeCoin.deployed();
      const timelocker = await Timelocker.deployed();
      await timeCoin.approve(timelocker.address, 200, { from: accounts[0] });

      let blockTime = await timelocker.getCurrentBlockTime();
      blockTime = blockTime.toNumber() + 5;
      await timelocker.deposit(accounts[1], blockTime, 200, {
        from: accounts[0],
      });

      let lockers = await timelocker.getLockers({ from: accounts[1] });
      let lockerId = lockers.length - 1;
      console.debug(lockers);
      await sleep(8000);
      await timelocker.release(lockerId, { from: accounts[1] });

      try {
        await timelocker.release(lockerId, { from: accounts[1] });
        assert.fail();
      } catch (error) {
        assert.include(error.message, "Already been released");
      }
    });
  });
});
