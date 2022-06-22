// contracts/CryptoBlessingNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoBlessingNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("CryptoBlessingNFT", "CBNFT") {}

    function awardBlessingNFT(address claimer, string memory blessingURI)
        public onlyOwner
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _mint(claimer, newItemId);
        _setTokenURI(newItemId, blessingURI);

        _tokenIds.increment();
        return newItemId;
    }
}