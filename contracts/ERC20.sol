// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.14;

contract ERC20TokenContract {
    address public owner;
    string public constant name = "Puppy Token";
    string public constant symbol = "PUPPY";
    uint8 public constant decimals = 18;
    uint256 public totalSupply = 100000000 * (10 ** uint256(decimals));
    // uint256 public contractBalances = totalSupply;              // the remaining token of the contract

    mapping(address => uint256) balances;                       // EOA -> tokens, if no data, return 0
    mapping(address => mapping(address => uint256)) allowed;    // EOA -> (allowedEOA -> tokens)

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event Disapproval(address indexed _owner, address indexed _spender);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {     
        owner = msg.sender;
        // contractBalances -= totalSupply;
        balances[owner] = totalSupply;
    }

    function setOwner(address _newOwner) public onlyOwner {
        require(_newOwner == address(_newOwner));
        owner = _newOwner;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) { 
        return balances[_owner]; 
    }

    // transfer tokens to another account by owner himself
    function transfer(address _to, uint256 _value) public returns (bool success) { 
        if(_value > 0 
            && balances[msg.sender] >= _value           // check owner's balance is enough to transfer
            && balances[_to] + _value > balances[_to]   // check there's no overflow after transfer
            && _to == address(_to)) {

                balances[msg.sender] -= _value;
                balances[_to] += _value;
                emit Transfer(msg.sender, _to, _value);
                return true;
        } 
        return false;
    }

    // transfer tokens to another account by owner's allowed account (operator)
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){ 
        if(_value > 0 
            && balances[_from] >= _value
            && allowed[_from][msg.sender] >= _value     // the operator has been apporved enough tokens
            && balances[_to] + _value > balances[_to]   // check overflow
            && _to == address(_to)) {

                balances[_from] -= _value;
                allowed[_from][msg.sender] -= _value;
                balances[_to] += _value;
                emit Transfer( _from, _to, _value);
                return true;
        } 
        return false;
    }
    
    function approve(address _spender, uint256 _value) public returns (bool success) {
        require(_spender == address(_spender)); 

        allowed[msg.sender][_spender] += _value; // will add more allowed tokens if _spender is approved before
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function disapprove(address _spender) public returns (bool success) {
        allowed[msg.sender][_spender] = 0;
        emit Disapproval(msg.sender, _spender);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}