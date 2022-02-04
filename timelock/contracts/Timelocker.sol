// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Timelocker {
  struct Locker {
    uint256 releaseTime;
    uint256 amount;
    bool released;
  }
  ERC20 private immutable _token;
  mapping(address => Locker[]) _lockers;

  constructor(address tokenAddress) {
    _token = ERC20(tokenAddress);
  }

  function getCurrentBlockTime() external view returns (uint256) {
    return block.timestamp;
  }

  function getLockers() external view returns (Locker[] memory) {
    return _lockers[msg.sender];
  }

  function deposit(
    address recipent,
    uint256 releaseTime,
    uint256 amount
  ) public {
    _token.transferFrom(msg.sender, address(this), amount);
    Locker memory newLocker = Locker({
      releaseTime: releaseTime,
      amount: amount,
      released: false
    });
    _lockers[recipent].push(newLocker);
  }

  function deposits(
    address[] memory recipents,
    uint256 releaseTime,
    uint256 amount
  ) external {
    for (uint256 i = 0; i < recipents.length; i++) {
      deposit(recipents[i], releaseTime, amount);
    }
  }

  function release(uint256 lockerId) external {
    require(_lockers[msg.sender].length >= lockerId, "Locker does not exist");
    require(
      _lockers[msg.sender][lockerId].releaseTime <= block.timestamp,
      "Not yet can release"
    );
    require(
      _lockers[msg.sender][lockerId].released == false,
      "Already been released"
    );
    _token.transfer(msg.sender, _lockers[msg.sender][lockerId].amount);
    _lockers[msg.sender][lockerId].released = true;
  }
}
