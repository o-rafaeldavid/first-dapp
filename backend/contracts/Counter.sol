// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Counter {
   string public name;
   uint256 public count;

   event Increment(uint256 when, address indexed who, uint256 byHowMuch, uint256 newCount);

   event Decrement(uint256 when, address indexed who, uint256 byHowMuch, uint256 newCount);

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

   function setName(string memory _newName) public returns (string memory newName) {
      name = _newName;
      return name;
   }
}
