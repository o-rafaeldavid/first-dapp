//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

// solhint-disable no-global-import
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RE is ERC721, Ownable {
    uint256 private _nextTokenId;

    constructor(address initialOwner) ERC721("Real Estate", "RE") Ownable(initialOwner) {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }
}
