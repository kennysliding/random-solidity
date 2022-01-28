const KennyCoin = artifacts.require("KennyCoin");

contract("KennyCoin tests", async (accounts) => {
  console.log(accounts);

  beforeEach(async () => {
    kennyCoin = await KennyCoin.deployed();
  });

  it("creation: should create an initial balance of 10000 for the creator", async () => {
    const balance = await kennyCoin.getBalance.call(accounts[0]);
    assert.strictEqual(balance.toNumber(), 10000);
  });

  it("should send coin correctly", async () => {
    // Get initial balances of first and second account.
    const account_one = accounts[0];
    const account_two = accounts[1];

    const amount = 10;

    let balance = await kennyCoin.getBalance.call(account_one);
    const account_one_starting_balance = balance.toNumber();

    balance = await kennyCoin.getBalance.call(account_two);
    const account_two_starting_balance = balance.toNumber();
    await kennyCoin.transfer(account_two, amount, {
      from: account_one,
    });

    balance = await kennyCoin.getBalance.call(account_one);
    const account_one_ending_balance = balance.toNumber();

    balance = await kennyCoin.getBalance.call(account_two);
    const account_two_ending_balance = balance.toNumber();

    assert.equal(
      account_one_ending_balance,
      account_one_starting_balance - amount,
      "Amount wasn't correctly taken from the sender"
    );
    assert.equal(
      account_two_ending_balance,
      account_two_starting_balance + amount,
      "Amount wasn't correctly sent to the receiver"
    );
  });
});
