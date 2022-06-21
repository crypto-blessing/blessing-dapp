// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CBToken is ERC20,  Ownable {
    constructor() ERC20("CryptoBlessing", "CB") {
        _mint(msg.sender, 79 * 100000000 * 10 ** decimals());
    }

    function decimals() public view virtual override returns (uint8) {
        return 9;
    }

}