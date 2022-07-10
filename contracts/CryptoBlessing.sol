// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "hardhat/console.sol";

interface ICryptoBlessingNFT {
    function awardBlessingNFT(address claimer, string memory blessingURI) external returns (uint256);
    function transferOwnership(address newOwner) external;
}

contract CryptoBlessing is Ownable, Pausable, ReentrancyGuard {

    using SafeMath for uint256;

    // 发送的token地址
    address sendTokenAddress; 
    // 奖励的CB token地址
    address cryptoBlessingTokenAddress;
    // nft
    address cryptoBlessingNFTAddress;

    uint256 CBTOKENAWARDRATIO = 5;

    uint256 CLAIM_TAX_RATE = 10; // 1000

    event senderSendCompleted(address sender, address blessingID);

    event claimerClaimComplete(address sender, address blessingID);

    event senderRevokeComplete(address sender, address blessingID);

    function setCBTOKENAWARDRATIO(uint256 _CBTOKENAWARDRATIO) public onlyOwner {
        CBTOKENAWARDRATIO = _CBTOKENAWARDRATIO;
    }


    function setCLAIM_TAX_RATE(uint256 _CLAIM_TAX_RATE) public onlyOwner {
        CLAIM_TAX_RATE = _CLAIM_TAX_RATE;
    }
    constructor(address _sendTokenAddress, address _cryptoBlessingTokenAddress, address _cryptoBlessingNFTAddress) payable {
        console.log("Blessing is the most universal human expression of emotion, and we are NFTizing it!");
        console.log("sendTokenAddress: %s", _sendTokenAddress);
        console.log("CBTokenAddress: %s", _cryptoBlessingTokenAddress);
        sendTokenAddress = _sendTokenAddress;
        cryptoBlessingTokenAddress = _cryptoBlessingTokenAddress;
        cryptoBlessingNFTAddress = _cryptoBlessingNFTAddress;
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
        uint256 claimQuantity;
        ClaimType claimType;
        bool revoked;
    }
    
    // 发送者的祝福列表
    mapping (address => SenderBlessing[]) senderBlessingMapping;

    function getMySendedBlessings() public view returns (SenderBlessing[] memory) {
        return senderBlessingMapping[msg.sender];
    }

    function getAllInfoOfBlessing(address sender, address blessingID) public view returns (Blessing memory, SenderBlessing memory, BlessingClaimStatus[] memory) {
        SenderBlessing[] memory senderBlessings = senderBlessingMapping[sender];
        SenderBlessing memory choosedSenderBlessing;
        for (uint256 i = 0; i < senderBlessings.length; i ++) {
            if (senderBlessings[i].blessingID == blessingID) {
                choosedSenderBlessing = senderBlessings[i];
            }
        }
        require(choosedSenderBlessing.tokenAmount > 0, "There is no blessing found on this sender!");
        BlessingClaimStatus[] memory blessingClaimStatus = blessingClaimStatusMapping[blessingID];
        Blessing memory choosedBlessing;
        for (uint256 i = 0; i < blessingList.length; i ++) {
            if (compareStrings(blessingList[i].image, choosedSenderBlessing.blessingImage)) {
                choosedBlessing = blessingList[i];
                break;
            }
        }
        return (choosedBlessing, choosedSenderBlessing, blessingClaimStatus);
    }

    struct ClaimerBlessing {
        address sender;
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
        uint8 deleted;
        uint256 taxRate; // 100
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
        uint8 blessingType,
        uint256 taxRate
    ) public onlyOwner {
        console.log("start to add blessing to the pool!");
        blessingList.push(Blessing(
            image, description, price, blessingOwner, blessingType, block.timestamp, 0, taxRate
        ));
    }

    function updateBlessing(string memory image, uint256 price, uint8 deleted, uint256 taxRate) public onlyOwner {
        console.log("start to remove one blessing from the pool! image:%s", image);
        for (uint256 i = 0; i < blessingList.length; i ++) {
            if (compareStrings(blessingList[i].image, image)) {
                blessingList[i].deleted = deleted;
                blessingList[i].price = price;
                blessingList[i].taxRate = taxRate;
                break;
            }
        }
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(bytes(a)) == keccak256(bytes(b)));
    }

    function sendBlessing(
        string memory image,
        address blessingID,
        uint256 tokenAmount,
        uint256 claimQuantity,
        ClaimType claimType
    ) public whenNotPaused {
        console.log("start to send blessing! image:%s, blessingID:%s", image, blessingID);
        console.log("tokenAmount: %s", tokenAmount);
        console.log("claimQuantity: %s", claimQuantity);
        console.log("claimType: %s", uint(claimType));
        require(0 < tokenAmount, "tokenAmount must be greater than 0");
        require(0 < claimQuantity && claimQuantity <= 1000, "claimQuantity must be greater than 0 and less or equal than 1000");
        Blessing memory choosedBlessing;
        for (uint256 i = 0; i < blessingList.length; i ++) {
            if (compareStrings(blessingList[i].image, image)) {
                choosedBlessing = blessingList[i];
                break;
            }
        }
        require(choosedBlessing.price > 0 && choosedBlessing.deleted == 0, "Invalid blessing status!");
        require(IERC20(sendTokenAddress).balanceOf(msg.sender) >= tokenAmount.add((claimQuantity.mul(choosedBlessing.price))), "Your token amount must be greater than you are trying to send!");
        // require(IERC20(sendTokenAddress).approve(address(this), tokenAmount), "Approve failed!");
        require(IERC20(sendTokenAddress).transferFrom(msg.sender, address(this), tokenAmount), "Transfer to contract failed!");

        require(IERC20(sendTokenAddress).transferFrom(msg.sender, choosedBlessing.owner, claimQuantity.mul(choosedBlessing.price).mul(100 - choosedBlessing.taxRate).div(100)), "Transfer to the owner of blessing failed!");
        require(IERC20(sendTokenAddress).transferFrom(msg.sender, address(this), claimQuantity.mul(choosedBlessing.price).mul(choosedBlessing.taxRate).div(100)), "Transfer to the contract failed!");

        senderBlessingMapping[msg.sender].push(SenderBlessing(
            blessingID,
            image,
            block.timestamp,
            tokenAmount,
            claimQuantity,
            claimType,
            false
        ));

        emit senderSendCompleted(msg.sender, blessingID);
    }

    function revokeBlessing(address blessingID) public whenNotPaused {
        BlessingClaimStatus[] memory blessingClaimStatusList = blessingClaimStatusMapping[blessingID];
        require(blessingClaimStatusList.length == 0, "Your blessing is claiming by others. Can not revoke anymore!");

        SenderBlessing[] memory senderBlessings = senderBlessingMapping[msg.sender];
        require(senderBlessings.length > 0, "There is no blessing found on this sender!");
        SenderBlessing memory choosedSenderBlessing;
        uint256 choosedIndex;
        for (uint256 i = 0; i < senderBlessings.length; i ++) {
            if (senderBlessings[i].blessingID == blessingID) {
                choosedSenderBlessing = senderBlessings[i];
                choosedIndex = i;
            }
        }
        require(choosedSenderBlessing.tokenAmount > 0, "There is no blessing found on this sender!");
        require(IERC20(sendTokenAddress).transfer(msg.sender, choosedSenderBlessing.tokenAmount), "Transfer back to sender failed!");
        senderBlessingMapping[msg.sender][choosedIndex].revoked = true;

        emit senderRevokeComplete(msg.sender, blessingID);
    }

    function claimBlessing(
        address sender,
        address blessingID,
        bytes32 hash,
        bytes memory signature,
        address fuckOff
    ) payable public whenNotPaused nonReentrant returns (ClaimerBlessing memory){
        console.log("start to claim blessing! sender:%s, blessingID:%s", sender, blessingID);
        require(fuckOff == msg.sender, "fuckOff!!!");
        require(_verify(hash, signature, blessingID), "Invalid signiture!");
        console.log("signature is valid!");
        require(!Address.isContract(msg.sender), "You can not claim blessing from contract!");
        SenderBlessing[] memory senderBlessings = senderBlessingMapping[sender];
        require(senderBlessings.length > 0, "There is no blessing found on this sender!");
        SenderBlessing memory choosedSenderBlessing;
        for (uint256 i = 0; i < senderBlessings.length; i ++) {
            if (senderBlessings[i].blessingID == blessingID) {
                choosedSenderBlessing = senderBlessings[i];
            }
        }
        require(choosedSenderBlessing.revoked == false, "This blessing is revoked!");
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
            distributionAmount = choosedSenderBlessing.tokenAmount.div(choosedSenderBlessing.claimQuantity);
        } else if (choosedSenderBlessing.claimType == ClaimType.RANDOM_CLAIM) {
            uint256 leftQuantity = choosedSenderBlessing.claimQuantity.sub(blessingClaimStatusList.length);
            uint randromNumber = _random(10);
            if (leftQuantity == 1) {
                distributionAmount = choosedSenderBlessing.tokenAmount.sub(distributedAmount);
            } else {
                distributionAmount = choosedSenderBlessing.tokenAmount.sub(distributedAmount).div(leftQuantity).mul(randromNumber).div(10).mul(2);
            }
        }

        ClaimerBlessing memory claimerBlessing = ClaimerBlessing(
            sender,
            blessingID,
            choosedSenderBlessing.blessingImage,
            block.timestamp,
            distributionAmount.div(1000).mul(1000 - CLAIM_TAX_RATE),
            distributionAmount.div(1000).mul(CLAIM_TAX_RATE)
        );

        claimerBlessingMapping[msg.sender].push(claimerBlessing);

        uint256 CBTokenAward = distributionAmount.div(10 ** 18).mul(CBTOKENAWARDRATIO);
        if (CBTokenAward > 1000) {
            CBTokenAward = 999;
        }

        blessingClaimStatusMapping[blessingID].push(BlessingClaimStatus(
            msg.sender,
            block.timestamp,
            distributionAmount,
            distributionAmount.div(1000).mul(1000 - CLAIM_TAX_RATE),
            distributionAmount.div(1000).mul(CLAIM_TAX_RATE),
            CBTokenAward
        ));

        require(IERC20(sendTokenAddress).transfer(msg.sender, distributionAmount.div(1000).mul(1000 - CLAIM_TAX_RATE)), "Claim the token failed!");
        require(IERC20(sendTokenAddress).transfer(owner(), distributionAmount.div(1000).mul(CLAIM_TAX_RATE)), "Tansfer tax failed!");
        
        // award 10 CB tokens to the sender
        if(IERC20(cryptoBlessingTokenAddress).balanceOf(address(this)) >= CBTokenAward) {
            require(IERC20(cryptoBlessingTokenAddress).transfer(sender, CBTokenAward), "award CB tokens failed!");
        }

        // award blessing NFT.
        ICryptoBlessingNFT(cryptoBlessingNFTAddress).awardBlessingNFT(msg.sender, choosedSenderBlessing.blessingImage);

        emit claimerClaimComplete(sender, blessingID);
        return claimerBlessing;
    }

    function _random(uint number) internal view returns(uint){
        uint rand = uint(blockhash(block.number-1)) % number;
        if (rand == 0 || rand == 10) {
            rand = 1;
        }
        return rand;
    }

    function _verify(bytes32 data, bytes memory signature, address account) internal pure returns (bool) {
        address signatureAddress = ECDSA.recover(data, signature);
        return signatureAddress == account;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function upgradeToV2(address v2ContractAddress) public onlyOwner whenPaused {
        require(IERC20(cryptoBlessingTokenAddress).transfer(v2ContractAddress, IERC20(cryptoBlessingTokenAddress).balanceOf(address(this))), "Transfer CBT to v2 address failed!");
        ICryptoBlessingNFT(cryptoBlessingNFTAddress).transferOwnership(v2ContractAddress);
    }

}
