// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TimeCoin is ERC20 {
  constructor() public ERC20("TimeCoin", "TCO") {
    _mint(msg.sender, 10000);
  }
}
