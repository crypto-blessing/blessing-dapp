// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract CryptoBlessing is Ownable {

    // 发送的token地址
    address sendTokenAddress; 
    // 奖励的CB token地址
    address CBTokenAddress;

    constructor(address _sendTokenAddress, address _CBTokenAddress) payable {
        console.log("Blessing is the most universal human expression of emotion, and we are NFTizing it!");
        console.log("sendTokenAddress: %s", _sendTokenAddress);
        console.log("CBTokenAddress: %s", _CBTokenAddress);
        sendTokenAddress = _sendTokenAddress;
        CBTokenAddress = _CBTokenAddress;
    }

    enum ClaimType {
        AVERAGE_CLAIM,
        RANDOM_CLAIM
    }

    struct SenderBlessing {
        string blessingID;
        string blessingImage;
        uint256 sendTimestamp;
        uint256 tokenAmount;
        uint8 claimQuantity;
        ClaimType claimType;
    }
    
    // 发送者的祝福列表
    mapping (address => SenderBlessing[]) senderBlessingMapping;

    function getMySendedBlessings() public view returns (SenderBlessing[] memory) {
        return senderBlessingMapping[msg.sender];
    }

    struct ClaimerBlessing {
        string blessingID;
        string blessingImage;
        uint256 claimTimestamp;
        uint256 tokenAmount;
    }

    // 接收者的祝福列表
    mapping (address => ClaimerBlessing[]) claimerBlessingMapping;

    function getMyClaimedBlessings() public view returns (ClaimerBlessing[] memory) {
        return claimerBlessingMapping[msg.sender];
    }

    struct BlessingClaimStatus {
        address claimer;
        uint256 claimTimestamp;
        uint256 claimAmount;
        uint256 CBTokenAwardToSenderAmount;
    }

    // 祝福的状态列表
    mapping (string => BlessingClaimStatus[]) blessingClaimStatusMapping;

    function getBlessingClaimingStatus(string memory _blessingID) public view returns (BlessingClaimStatus[] memory) {
        return blessingClaimStatusMapping[_blessingID];
    }

    struct Blessing {
        string image; // 祝福图片
        string description; // 祝福描述
        uint256 price;
        address owner;
        uint8 blessingType;
        uint256 timestamp;
    }
    Blessing[] public blessingList;

    function getAllBlessings() public view returns (Blessing[] memory) {
        return blessingList;
    }

    function addBlessing(
        string memory image,
        string memory description,
        uint256 price,
        uint8 blessingType
    ) public onlyOwner {
        console.log("start to add blessing to the pool!");
        blessingList.push(Blessing(
            image, description, price, msg.sender, blessingType, block.timestamp
        ));
    }

    function removeBlessing(string memory image) public onlyOwner {
        console.log("start to remove one blessing from the pool! image:%s", image);
        uint256 index = 0;
        for (uint256 i = 0; i < blessingList.length; i ++) {
            if (compareStrings(blessingList[i].image, image)) {
                index = i;
                break;
            }
        }
        for (uint256 i = index; i < blessingList.length - 1; i ++){
            blessingList[i] = blessingList[i+1];
        }
        blessingList.pop();
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(bytes(a)) == keccak256(bytes(b)));
    }

    function sendBlessing(
        string memory image,
        string memory blessingID,
        uint256 tokenAmount,
        uint8 claimQuantity,
        ClaimType claimType
    ) public {
        console.log("start to send blessing! image:%s", image);
        Blessing memory choosedBlessing;
        for (uint256 i = 0; i < blessingList.length; i ++) {
            if (compareStrings(blessingList[i].image, image)) {
                choosedBlessing = blessingList[i];
                break;
            }
        }
        require(choosedBlessing.price > 0, "Invalid blessing!");
        require(IERC20(sendTokenAddress).balanceOf(msg.sender) >= tokenAmount, "Your token amount must be greater then you are trying to send");
        require(IERC20(sendTokenAddress).approve(address(this), tokenAmount));
        require(IERC20(sendTokenAddress).transferFrom(msg.sender, address(this), tokenAmount));


        senderBlessingMapping[msg.sender].push(SenderBlessing(
            blessingID,
            image,
            block.timestamp,
            tokenAmount,
            claimQuantity,
            claimType
        ));
    }

}