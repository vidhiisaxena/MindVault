// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MEMOXToken is ERC20 {
    constructor() ERC20("MEMOX", "MEMOX") {
        _mint(msg.sender, 1000 * 10 ** decimals()); 
    }
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
    function redeemCredits() public {
    uint256 balance = balanceOf(msg.sender);
    require(balance > 0, "No tokens to redeem");
    _burn(msg.sender, balance);
    }

}
