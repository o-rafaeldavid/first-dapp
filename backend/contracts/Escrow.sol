// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Escrow {
    address public nftAddress;
    uint256 public nftID;

    constructor(address _nftAddress, uint256 _nftID) {
        nftAddress = _nftAddress;
        nftID = _nftID;
    }
    function finalizeSale() public {
        // transfer ownership of the NFT to the buyer
    }
}
