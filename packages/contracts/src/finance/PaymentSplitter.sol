// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../token/ERC20/IERC20.sol";
import "../token/ERC20/utils/SafeERC20.sol";
import "../access/AccessControl.sol";
import "../utils/ReentrancyGuard.sol";

contract PaymentSplitter is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    event PayeeAdded(address account, uint256 shares);
    event PaymentReleased(address to, uint256 amount);
    event ERC20PaymentReleased(IERC20 token, address to, uint256 amount);
    event PaymentReceived(address from, uint256 amount);
    
    uint256 private _totalShares;
    uint256 private _totalReleased;
    
    mapping(address => uint256) private _shares;
    mapping(address => uint256) private _released;
    address[] private _payees;
    
    mapping(IERC20 => uint256) private _erc20TotalReleased;
    mapping(IERC20 => mapping(address => uint256)) private _erc20Released;
    
    constructor(address[] memory payees, uint256[] memory shares_) payable {
        require(payees.length == shares_.length, "PaymentSplitter: payees and shares length mismatch");
        require(payees.length > 0, "PaymentSplitter: no payees");
        
        for (uint256 i = 0; i < payees.length; i++) {
            _addPayee(payees[i], shares_[i]);
        }
    }
    
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }
    
    function totalShares() external view returns (uint256) {
        return _totalShares;
    }
    
    function totalReleased() external view returns (uint256) {
        return _totalReleased;
    }
    
    function totalReleased(IERC20 token) external view returns (uint256) {
        return _erc20TotalReleased[token];
    }
    
    function shares(address account) external view returns (uint256) {
        return _shares[account];
    }
    
    function released(address account) external view returns (uint256) {
        return _released[account];
    }
    
    function released(IERC20 token, address account) external view returns (uint256) {
        return _erc20Released[token][account];
    }
    
    function payee(uint256 index) external view returns (address) {
        return _payees[index];
    }
    
    function releasable(address account) public view returns (uint256) {
        uint256 totalReceived = address(this).balance + _totalReleased;
        return _pendingPayment(account, totalReceived, _released[account]);
    }
    
    function releasable(IERC20 token, address account) public view returns (uint256) {
        uint256 totalReceived = token.balanceOf(address(this)) + _erc20TotalReleased[token];
        return _pendingPayment(account, totalReceived, _erc20Released[token][account]);
    }
    
    function release(address payable account) public nonReentrant {
        uint256 payment = releasable(account);
        require(payment != 0, "PaymentSplitter: account is not due payment");
        
        _totalReleased += payment;
        _released[account] += payment;
        
        Address.sendValue(account, payment);
        emit PaymentReleased(account, payment);
    }
    
    function release(IERC20 token, address account) public nonReentrant {
        uint256 payment = releasable(token, account);
        require(payment != 0, "PaymentSplitter: account is not due payment");
        
        _erc20TotalReleased[token] += payment;
        _erc20Released[token][account] += payment;
        
        token.safeTransfer(account, payment);
        emit ERC20PaymentReleased(token, account, payment);
    }
    
    function _addPayee(address account, uint256 shares_) private {
        require(account != address(0), "PaymentSplitter: account is the zero address");
        require(shares_ > 0, "PaymentSplitter: shares are 0");
        require(_shares[account] == 0, "PaymentSplitter: account already has shares");
        
        _payees.push(account);
        _shares[account] = shares_;
        _totalShares += shares_;
        emit PayeeAdded(account, shares_);
    }
    
    function _pendingPayment(address account, uint256 totalReceived, uint256 alreadyReleased) private view returns (uint256) {
        return (totalReceived * _shares[account]) / _totalShares - alreadyReleased;
    }
}

library Address {
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");
        
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
}
