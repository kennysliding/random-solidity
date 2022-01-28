// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KCoin is ERC20 {
  constructor() public ERC20("KCoin", "KCO") {
    _mint(msg.sender, 10000);
  }
}
