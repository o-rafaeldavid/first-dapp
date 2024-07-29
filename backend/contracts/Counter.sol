// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Counter {
    string private name;
    uint256 private count;

    event Increment(uint256 when, address indexed who, uint256 byHowMuch, uint256 newCount);
    event Decrement(uint256 when, address indexed who, uint256 byHowMuch, uint256 newCount);
    event NameModified(uint256 when, address indexed who, string oldName, string newName);

    constructor(string memory _name, uint256 _initialCount) {
        name = _name;
        count = _initialCount;
    }

    function increment() public {
        count++;
        emit Increment(block.timestamp, msg.sender, 1, count);
    }

    function decrement() public {
        count--;
        emit Decrement(block.timestamp, msg.sender, 1, count);
    }

    function getCount() public view returns (uint256) {
        return count;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function setName(string memory _newName) public returns (string memory newName) {
        emit NameModified(block.timestamp, msg.sender, name, _newName);
        name = _newName;
        return name;
    }
}
