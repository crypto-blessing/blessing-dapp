// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
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
        address blessingID;
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
        address blessingID;
        string blessingImage;
        uint256 claimTimestamp;
        uint256 claimAmount;
        uint256 taxAmount;
    }

    // 接收者的祝福列表
    mapping (address => ClaimerBlessing[]) claimerBlessingMapping;

    function getMyClaimedBlessings() public view returns (ClaimerBlessing[] memory) {
        return claimerBlessingMapping[msg.sender];
    }

    struct BlessingClaimStatus {
        address claimer;
        uint256 claimTimestamp;
        uint256 distributedAmount;
        uint256 claimAmount;
        uint256 taxAmount;
        uint256 CBTokenAwardToSenderAmount;
    }

    // 祝福的状态列表 blessingID => BlessingClaimStatus[]
    mapping (address => BlessingClaimStatus[]) blessingClaimStatusMapping;

    function getBlessingClaimingStatus(address _blessingID) public view returns (BlessingClaimStatus[] memory) {
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
        address blessingOwner,
        string memory description,
        uint256 price,
        uint8 blessingType
    ) public onlyOwner {
        console.log("start to add blessing to the pool!");
        blessingList.push(Blessing(
            image, description, price, blessingOwner, blessingType, block.timestamp
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
        address blessingID,
        uint256 tokenAmount,
        uint8 claimQuantity,
        ClaimType claimType
    ) public {
        console.log("start to send blessing! image:%s, blessingID:%s", image, blessingID);
        console.log("tokenAmount: %s", tokenAmount);
        console.log("claimQuantity: %s", claimQuantity);
        console.log("claimType: %s", uint(claimType));
        require(0 < tokenAmount, "tokenAmount must be greater than 0");
        require(0 < claimQuantity && claimQuantity <= 10, "claimQuantity must be greater than 0 and less or equal than 10");
        Blessing memory choosedBlessing;
        for (uint256 i = 0; i < blessingList.length; i ++) {
            if (compareStrings(blessingList[i].image, image)) {
                choosedBlessing = blessingList[i];
                break;
            }
        }
        require(choosedBlessing.price > 0, "Invalid blessing!");
        require(IERC20(sendTokenAddress).balanceOf(msg.sender) >= tokenAmount + (claimQuantity * choosedBlessing.price), "Your token amount must be greater than you are trying to send!");
        // require(IERC20(sendTokenAddress).approve(address(this), tokenAmount), "Approve failed!");
        require(IERC20(sendTokenAddress).transferFrom(msg.sender, address(this), tokenAmount), "Transfer to contract failed!");
        require(IERC20(sendTokenAddress).transferFrom(msg.sender, choosedBlessing.owner, claimQuantity * choosedBlessing.price), "Transfer to the owner of blessing failed!");

        senderBlessingMapping[msg.sender].push(SenderBlessing(
            blessingID,
            image,
            block.timestamp,
            tokenAmount,
            claimQuantity,
            claimType
        ));
    }

    function claimBlessing(
        address sender,
        address blessingID,
        bytes32 hash,
        bytes memory signature
    ) public {
        console.log("start to claim blessing! sender:%s, blessingID:%s", sender, blessingID);
        require(_verify(hash, signature, blessingID), "Invalid signiture!");
        console.log("signature is valid!");
        SenderBlessing[] memory senderBlessings = senderBlessingMapping[sender];
        require(senderBlessings.length > 0, "There is no blessing found on this sender!");
        SenderBlessing memory choosedSenderBlessing;
        for (uint256 i = 0; i < senderBlessings.length; i ++) {
            if (senderBlessings[i].blessingID == blessingID) {
                choosedSenderBlessing = senderBlessings[i];
            }
        }
        
        require(choosedSenderBlessing.tokenAmount > 0, "There is no blessing found on this sender!");
        BlessingClaimStatus[] memory blessingClaimStatusList = blessingClaimStatusMapping[blessingID];
        require(blessingClaimStatusList.length < choosedSenderBlessing.claimQuantity, "There is no more blessings!");


        uint256 distributedAmount = 0;
        for (uint256 i = 0; i < blessingClaimStatusList.length; i ++) {
            require(blessingClaimStatusList[i].claimer != msg.sender, "You have already claimed this blessing!");
            distributedAmount += blessingClaimStatusList[i].distributedAmount;
        }


        uint256 distributionAmount = 0;
        if (choosedSenderBlessing.claimType == ClaimType.AVERAGE_CLAIM) {
            distributionAmount = choosedSenderBlessing.tokenAmount / choosedSenderBlessing.claimQuantity;
        } else if (choosedSenderBlessing.claimType == ClaimType.RANDOM_CLAIM) {
            uint randromNumber = _random(choosedSenderBlessing.claimQuantity);
            uint256 leftQuantity = choosedSenderBlessing.claimQuantity - blessingClaimStatusList.length;
            if (leftQuantity == 1) {
                distributionAmount = choosedSenderBlessing.tokenAmount - distributedAmount;
            } else {
                distributionAmount = (choosedSenderBlessing.tokenAmount - distributedAmount) / leftQuantity * randromNumber / leftQuantity;
            }
        }

        require(IERC20(sendTokenAddress).transfer(msg.sender, distributionAmount / 100 * 95), "Claim the token failed!");

        blessingClaimStatusMapping[blessingID].push(BlessingClaimStatus(
            msg.sender,
            block.timestamp,
            distributionAmount,
            distributionAmount / 100 * 95,
            distributionAmount / 100 * 5,
            10
        ));

        claimerBlessingMapping[msg.sender].push(ClaimerBlessing(
            blessingID,
            choosedSenderBlessing.blessingImage,
            block.timestamp,
            distributionAmount / 100 * 95,
            distributionAmount / 100 * 5
        ));
    }

    function _random(uint number) internal view returns(uint){
        return uint(blockhash(block.number-1)) % number;
    }

    function _verify(bytes32 data, bytes memory signature, address account) internal pure returns (bool) {
        address signatureAddress = ECDSA.recover(data, signature);
        return signatureAddress == account;
    }

}
