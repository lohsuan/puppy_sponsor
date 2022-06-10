// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.14;

// TODO: Comprehensive Security Check, refer to https://consensys.github.io/smart-contract-best-practices
contract Transactions {
    address payable public owner;
    uint256 public transactionCount;
    uint256 public totalAmount;

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword, string metaData);
    event PuppyAdded(bytes32 dogId, string imageUrl, string name, string birthday, string description, uint256 timestamp);

    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
        string dogId; // dogId, -1 for donate food
    }

    struct Puppy {
        bytes32 dogId;
        string imageUrl;
        string name;
        string birthday;
        string description;
    }

    TransferStruct[] transactions;
    mapping(bytes32 => bool) puppyIdSet;
    Puppy[] puppies;

    constructor(address payable _owner) {
        require(_owner == address(_owner));
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function setOwner(address payable _newOwner) public onlyOwner {
        require(_newOwner == address(_newOwner));
        owner = _newOwner;
    }

    function checkIsOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    function donateForFood(string memory message, string memory keyword) public payable {
        transactionCount += 1;
        totalAmount += msg.value;
        transactions.push(TransferStruct(msg.sender, owner, msg.value, message, block.timestamp, keyword, "-1"));
        owner.transfer(msg.value);

        emit Transfer(msg.sender, owner, msg.value, message, block.timestamp, keyword, "-1");
    }

    function donateForPuppy(string memory dogId, string memory message, string memory keyword) public payable {
        transactionCount += 1;
        totalAmount += msg.value;
        transactions.push(TransferStruct(msg.sender, owner, msg.value, message, block.timestamp, keyword, dogId));
        owner.transfer(msg.value);

        emit Transfer(msg.sender, owner, msg.value, message, block.timestamp, keyword, dogId);
    }

    function addPuppy(string memory imageUrl, string memory name, string memory birthday, string memory description) public onlyOwner {
        bytes32 dogId = keccak256(abi.encodePacked(block.timestamp));
        while(puppyIdSet[dogId]){
            dogId = keccak256(abi.encodePacked(block.timestamp));
        }
        puppyIdSet[dogId] = true;
        puppies.push(Puppy(dogId, imageUrl, name, birthday, description));

        emit PuppyAdded(dogId, imageUrl, name, birthday, description, block.timestamp);
    }

    function getAllPuppies() public view returns (Puppy[] memory) {
        return puppies;
    }

    // all transactions (optimize: paging)
    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }
}