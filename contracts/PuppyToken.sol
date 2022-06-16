// SPDX-License-Identifier: MIT
pragma solidity  0.8.14;

import "./IERC20.sol";
import "./Ownable.sol";

/** 
 * @dev this contract implement {IERC20} interface (define in EIT)
 *
 * The total quantity of this token has no upper limit, totalSupply represents how many tokens have been sent (minted)
 * When deploying, mint 10000000000 tokens to the contract owner (the person who deploys this contract)
 * The total quantity of this token is fixed when this contract is deployed (Fixed Supply = 10000000000)
 * Only the owner can mint tokens, and burn the tokens of a specific address
 */
 
/// @author NTUT smart contract class - team 9
/// @title Puppy token: a ERC20 contract as Puppy Sponsor's token
contract PuppyToken is IERC20, Ownable {
 
     /**
     * @dev Balances for each account
     */
    mapping(address => uint256) private _balances;

    /**
     * @dev Owner of account approves the transfer of an amount to another account.
     */
    mapping(address => mapping(address => uint256)) private _allowances; // authorizer => (authorized EOA => authorized amount)

    /**
     * @dev Amount of tokens in existence
     */
    uint256 public totalSupply; 

    string public constant name = "Puppy Token";
    string public constant symbol = "PUPPY";
    uint8 public constant decimals = 0;

    /**
     * @dev This contract will mint 10000000000 token to the person who deploys when deploying
     */
    constructor() {
        _mint(msg.sender, 10000000000);
    }

    /** 
     * @dev Creates `amount` tokens and assigns them to owner's account
     */
    function mint(uint256 amount) public onlyOwner {
        _mint(owner(), amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, reducing the total supply. 
     * 
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` and `totalSupply` must have at least `amount` tokens.
     */
    function burn(address account, uint256 amount) public onlyOwner {
        require(account != address(0), "PuppyToken: burn from the zero address");
        require(totalSupply >= amount, "PuppyToken: burn amount exceeds the total supply");
        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "PuppyToken: burn amount exceeds the balance of account");

        require(totalSupply - amount <  totalSupply, "PuppyToken: burn overflow");
        require(accountBalance - amount <  accountBalance, "PuppyToken: burn overflow");

        _balances[account] -= amount;
        totalSupply -= amount;

        emit Transfer(account, address(0), amount);
    }
 
    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        address owner = msg.sender;
        _transfer(owner, to, amount);
        return true;
    }

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits an {Approval} event.
     *
     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount) public override returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, amount);
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        address owner = msg.sender;
        uint256 currentAllowance = allowance(owner, spender);
        require(currentAllowance >= subtractedValue, "PuppyToken: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function _mint(
        address account,
         uint256 amount
    ) private {
        require(account != address(0), "PuppyToken: mint to the zero address");
        require(account == address(account), "PuppyToken: mint to the invalid address");

        totalSupply += amount;
        _balances[account] += amount;

        emit Transfer(address(0), account, amount);
    }

    /**
     * @dev Moves `amount` of tokens from `sender` to `recipient`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) private {
        require(from != address(0), "PuppyToken: transfer from the zero address");
        require(to != address(0), "PuppyToken: transfer to the zero address");
        
        uint256 balanceFrom = _balances[from];
        uint256 balanceTo = _balances[to];

        require(balanceFrom >= amount, "PuppyToken: transfer amount exceeds balance");
        
        require(balanceTo + amount > balanceTo, "PuppyToken: transfer overflow");
        require(balanceFrom - amount < balanceFrom, "PuppyToken: transfer overflow");

        _balances[from] -= amount;
        _balances[to] += amount;

        emit Transfer(from, to, amount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) private {
        require(owner != address(0), "PuppyToken: approve from the zero address");
        require(spender != address(0), "PuppyToken: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    
}