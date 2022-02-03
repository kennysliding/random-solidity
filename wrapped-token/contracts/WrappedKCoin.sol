// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WrappedKCoin is ERC20 {
  ERC20 kCoin;
  mapping(address => uint256) allowances;

  constructor(address ERC20TokenAddress) public ERC20("KWrapped", "KWR") {
    kCoin = ERC20(ERC20TokenAddress);
  }

  function approve(address spender, uint256 amount)
    public
    override
    returns (bool)
  {
    kCoin.approve(address(this), amount);
    allowances[msg.sender] = amount;
    return true;
  }

  function deposit(uint256 amount) external payable {
    kCoin.transferFrom(msg.sender, address(this), amount);
    _mint(msg.sender, amount / 2);
  }

  function withdraw(uint256 amount) external {
    kCoin.transfer(msg.sender, amount * 2);
    _burn(msg.sender, amount);
  }
}
