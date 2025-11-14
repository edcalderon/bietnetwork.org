// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./finance/PaymentSplitter.sol";
import "./token/ERC20/IERC20.sol";
import "./token/ERC20/utils/SafeERC20.sol";
import "./utils/ReentrancyGuard.sol";
import "./proxy/utils/Initializable.sol";

/**
 * @title BGT Treasury
 * @dev Módulo de tesorería para la gestión de fondos de Red Biet
 * @author Biet Network Team
 */
contract BGTTreasury is PaymentSplitter, ReentrancyGuard, Initializable {
    using SafeERC20 for IERC20;
    
    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    
    // Constants
    uint256 public constant MAX_EMERGENCY_WITHDRAWAL_PERCENTAGE = 500; // 5% in basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    // State variables
    address public bgtToken;
    address public daoAddress;
    uint256 public totalETHReceived;
    uint256 public totalBGTReceived;
    uint256 public emergencyWithdrawalCooldown;
    
    // Events
    event ETHReceived(address indexed from, uint256 amount);
    event BGTReceived(address indexed from, uint256 amount);
    event TokensWithdrawn(address indexed token, address indexed to, uint256 amount);
    event EmergencyWithdrawal(address indexed token, address indexed to, uint256 amount);
    event PaymentDistributed(address indexed payee, uint256 amount);
    event TreasuryConfigurationUpdated(string parameter, uint256 value);
    
    // Errors
    error InsufficientBalance();
    error UnauthorizedAccess();
    error InvalidAddress();
    error InvalidAmount();
    error EmergencyCooldownActive();
    error ExceedsMaxWithdrawalPercentage();
    error TransferFailed();
    
    constructor() PaymentSplitter(new address[](0), new uint256[](0)) {
        _disableInitializers();
    }
    
    /**
     * @dev Initialize the treasury
     * @param _bgtToken Address of BGT token
     * @param _daoAddress Address of the DAO
     * @param payees Array of payee addresses
     * @param shares Array of shares for each payee
     * @param admin Initial admin address
     */
    function initialize(
        address _bgtToken,
        address _daoAddress,
        address[] memory payees,
        uint256[] memory shares,
        address admin
    ) public initializer {
        if (_bgtToken == address(0) || _daoAddress == address(0)) {
            revert InvalidAddress();
        }
        
        bgtToken = _bgtToken;
        daoAddress = _daoAddress;
        emergencyWithdrawalCooldown = 7 days;
        
        // Set up roles
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
        _grantRole(EMERGENCY_ROLE, admin);
        
        // Initialize PaymentSplitter
        _setPayees(payees, shares);
    }
    
    /**
     * @dev Receive ETH and track it
     */
    receive() external payable nonReentrant {
        totalETHReceived += msg.value;
        emit ETHReceived(msg.sender, msg.value);
    }
    
    /**
     * @dev Receive BGT tokens and track them
     * @param amount Amount of BGT tokens to receive
     */
    function receiveBGT(uint256 amount) external nonReentrant {
        if (amount == 0) {
            revert InvalidAmount();
        }
        
        IERC20(bgtToken).safeTransferFrom(msg.sender, address(this), amount);
        totalBGTReceived += amount;
        emit BGTReceived(msg.sender, amount);
    }
    
    /**
     * @dev Withdraw ERC20 tokens
     * @param token Token address to withdraw
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function withdrawToken(
        address token,
        address to,
        uint256 amount
    ) external onlyRole(OPERATOR_ROLE) nonReentrant {
        if (to == address(0)) {
            revert InvalidAddress();
        }
        if (amount == 0) {
            revert InvalidAmount();
        }
        if (token == address(0)) {
            // ETH withdrawal
            if (address(this).balance < amount) {
                revert InsufficientBalance();
            }
            (bool success, ) = payable(to).call{value: amount}("");
            if (!success) {
                revert TransferFailed();
            }
        } else {
            // ERC20 withdrawal
            IERC20 tokenContract = IERC20(token);
            if (tokenContract.balanceOf(address(this)) < amount) {
                revert InsufficientBalance();
            }
            tokenContract.safeTransfer(to, amount);
        }
        
        emit TokensWithdrawn(token, to, amount);
    }
    
    /**
     * @dev Emergency withdrawal (limited percentage)
     * @param token Token address to withdraw
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(
        address token,
        address to,
        uint256 amount
    ) external onlyRole(EMERGENCY_ROLE) nonReentrant {
        if (to == address(0)) {
            revert InvalidAddress();
        }
        if (amount == 0) {
            revert InvalidAmount();
        }
        
        uint256 totalBalance;
        if (token == address(0)) {
            totalBalance = address(this).balance;
        } else {
            totalBalance = IERC20(token).balanceOf(address(this));
        }
        
        // Check withdrawal limit
        uint256 maxWithdrawal = (totalBalance * MAX_EMERGENCY_WITHDRAWAL_PERCENTAGE) / BASIS_POINTS;
        if (amount > maxWithdrawal) {
            revert ExceedsMaxWithdrawalPercentage();
        }
        
        if (token == address(0)) {
            (bool success, ) = payable(to).call{value: amount}("");
            if (!success) {
                revert TransferFailed();
            }
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
        
        emit EmergencyWithdrawal(token, to, amount);
    }
    
    /**
     * @dev Release payments to payees
     * @param payee Payee address to release funds to
     */
    function release(address payee) public override nonReentrant {
        super.release(payee);
        emit PaymentDistributed(payee, releasable(payee));
    }
    
    /**
     * @dev Release ERC20 tokens to payees
     * @param token Token address to release
     * @param payee Payee address
     */
    function release(IERC20 token, address payee) public override nonReentrant {
        super.release(token, payee);
        emit PaymentDistributed(payee, token.balanceOf(payee));
    }
    
    /**
     * @dev Get treasury balance for specific token
     * @param token Token address (address(0) for ETH)
     * @return Balance of the specified token
     */
    function getBalance(address token) external view returns (uint256) {
        if (token == address(0)) {
            return address(this).balance;
        } else {
            return IERC20(token).balanceOf(address(this));
        }
    }
    
    /**
     * @dev Get total treasury value in ETH (simplified)
     * @return Total estimated value in ETH
     */
    function getTotalValue() external view returns (uint256) {
        // This is a simplified version - in production you'd want price oracles
        return address(this).balance;
    }
    
    /**
     * @dev Check if address is authorized to operate treasury
     * @param account Address to check
     * @return True if authorized
     */
    function isAuthorized(address account) external view returns (bool) {
        return hasRole(OPERATOR_ROLE, account) || hasRole(ADMIN_ROLE, account);
    }
    
    /**
     * @dev Update emergency withdrawal cooldown
     * @param newCooldown New cooldown period in seconds
     */
    function updateEmergencyCooldown(uint256 newCooldown) external onlyRole(ADMIN_ROLE) {
        emergencyWithdrawalCooldown = newCooldown;
        emit TreasuryConfigurationUpdated("emergencyCooldown", newCooldown);
    }
    
    /**
     * @dev Add new payee with shares
     * @param payee New payee address
     * @param shares Number of shares for the payee
     */
    function addPayee(address payee, uint256 shares) external onlyRole(ADMIN_ROLE) {
        if (payee == address(0)) {
            revert InvalidAddress();
        }
        if (shares == 0) {
            revert InvalidAmount();
        }
        
        _addPayee(payee, shares);
    }
    
    /**
     * @dev Remove payee
     * @param payee Payee address to remove
     */
    function removePayee(address payee) external onlyRole(ADMIN_ROLE) {
        // This would require custom implementation in PaymentSplitter
        // For now, we'll just emit an event
        emit TreasuryConfigurationUpdated("payeeRemoved", uint256(uint160(payee)));
    }
    
    /**
     * @dev Get payee information
     * @param payee Payee address
     * @return shares Number of shares the payee has
     * @return released Amount already released to the payee
     * @return releasable Amount available for release
     */
    function getPayeeInfo(address payee) external view returns (uint256 shares, uint256 released, uint256 releasable) {
        shares = _shares(payee);
        released = _released(payee);
        releasable = this.releasable(payee);
    }
    
    /**
     * @dev Required override for PaymentSplitter
     */
    function _payee(address account) internal view override returns (address) {
        return super._payee(account);
    }
    
    /**
     * @dev Required override for PaymentSplitter
     */
    function _shares(address account) internal view override returns (uint256) {
        return super._shares(account);
    }
}
