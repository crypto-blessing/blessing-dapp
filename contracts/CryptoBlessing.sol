// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CryptoBlessing {

    // 发送的token地址
    address sendTokenAddress; 
    // 奖励的CB token地址
    address CBTokenAddress;

    constructor(address _sendTokenAddress, address _CBTokenAddress) {
        sendTokenAddress = _sendTokenAddress;
        CBTokenAddress = _CBTokenAddress;
    }
     

}