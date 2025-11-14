// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./finance/PaymentSplitter.sol";
import "./access/Ownable.sol";
import "./access/AccessControl.sol";
import "./token/ERC20/IERC20.sol";
import "./token/ERC20/utils/SafeERC20.sol";
import "./utils/ReentrancyGuard.sol";
import "./utils/math/Math.sol";

/**
 * @title RevenueShare
 * @dev Sistema de distribución de ingresos para Red Biet
 * @author Biet Network Team
 */
contract RevenueShare is PaymentSplitter, Ownable {
    using SafeERC20 for IERC20;
    using Math for uint256;
    
    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    // Constants
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant MAX_FEE_PERCENTAGE = 500; // 5% max fee
    
    // Revenue pool data structures
    struct RevenuePool {
        string name;
        address[] participants;
        uint256[] shares;
        uint256 totalShares;
        uint256 totalRevenue;
        uint256 totalDistributed;
        bool isActive;
        uint256 createdAt;
        address token; // address(0) for ETH
    }
    
    // Distribution record
    struct DistributionRecord {
        uint256 poolId;
        address recipient;
        uint256 amount;
        uint256 timestamp;
        string tokenSymbol;
    }
    
    // State variables
    uint256 public platformFeePercentage;
    address public treasuryAddress;
    uint256 public poolCounter;
    
    // Mappings
    mapping(uint256 => RevenuePool) public revenuePools;
    mapping(uint256 => mapping(address => uint256)) public participantShares;
    mapping(uint256 => mapping(address => uint256)) public participantEarnings;
    mapping(address => bool) public supportedTokens;
    mapping(uint256 => DistributionRecord[]) public distributionHistory;
    
    // Events
    event RevenuePoolCreated(
        uint256 indexed poolId,
        string name,
        address indexed token,
        uint256 totalShares
    );
    event RevenueReceived(
        uint256 indexed poolId,
        address indexed payer,
        uint256 amount,
        uint256 fee
    );
    event RevenueDistributed(
        uint256 indexed poolId,
        address indexed recipient,
        uint256 amount
    );
    event ParticipantAdded(
        uint256 indexed poolId,
        address indexed participant,
        uint256 shares
    );
    event ParticipantRemoved(
        uint256 indexed poolId,
        address indexed participant
    );
    event PlatformFeeUpdated(uint256 newFeePercentage);
    event TokenSupportUpdated(address indexed token, bool supported);
    
    // Errors
    error PoolNotFound();
    error PoolNotActive();
    error InvalidShares();
    error ParticipantAlreadyExists();
    error ParticipantNotFound();
    error InsufficientRevenue();
    error UnauthorizedAccess();
    error InvalidAmount();
    error UnsupportedToken();
    error TransferFailed();
    
    constructor(
        address[] memory payees,
        uint256[] memory shares,
        address _treasuryAddress,
        uint256 _platformFeePercentage
    ) PaymentSplitter(payees, shares) Ownable() {
        require(_treasuryAddress != address(0), "Invalid treasury address");
        require(_platformFeePercentage <= MAX_FEE_PERCENTAGE, "Fee too high");
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        
        treasuryAddress = _treasuryAddress;
        platformFeePercentage = _platformFeePercentage;
    }
    
    /**
     * @dev Create a new revenue pool
     * @param name Pool name
     * @param participants Array of participant addresses
     * @param shares Array of shares for each participant
     * @param token Token address (address(0) for ETH)
     * @return poolId ID of the created pool
     */
    function createRevenuePool(
        string memory name,
        address[] memory participants,
        uint256[] memory shares,
        address token
    ) external onlyRole(OPERATOR_ROLE) returns (uint256) {
        if (participants.length == 0 || participants.length != shares.length) {
            revert InvalidShares();
        }
        
        uint256 totalShares = 0;
        for (uint256 i = 0; i < shares.length; i++) {
            if (shares[i] == 0) {
                revert InvalidShares();
            }
            totalShares += shares[i];
        }
        
        uint256 poolId = ++poolCounter;
        
        revenuePools[poolId] = RevenuePool({
            name: name,
            participants: participants,
            shares: shares,
            totalShares: totalShares,
            totalRevenue: 0,
            totalDistributed: 0,
            isActive: true,
            createdAt: block.timestamp,
            token: token
        });
        
        // Set participant shares
        for (uint256 i = 0; i < participants.length; i++) {
            participantShares[poolId][participants[i]] = shares[i];
        }
        
        emit RevenuePoolCreated(poolId, name, token, totalShares);
        
        return poolId;
    }
    
    /**
     * @dev Receive ETH revenue for a pool
     * @param poolId Pool ID to receive revenue for
     */
    function receiveETHRevenue(uint256 poolId) external payable nonReentrant {
        if (poolId == 0 || !revenuePools[poolId].isActive) {
            revert PoolNotActive();
        }
        if (msg.value == 0) {
            revert InvalidAmount();
        }
        
        RevenuePool storage pool = revenuePools[poolId];
        
        // Calculate platform fee
        uint256 platformFee = (msg.value * platformFeePercentage) / BASIS_POINTS;
        uint256 revenueAmount = msg.value - platformFee;
        
        // Send platform fee to treasury
        if (platformFee > 0) {
            (bool success, ) = payable(treasuryAddress).call{value: platformFee}("");
            if (!success) {
                revert TransferFailed();
            }
        }
        
        // Update pool revenue
        pool.totalRevenue += revenueAmount;
        
        emit RevenueReceived(poolId, msg.sender, revenueAmount, platformFee);
    }
    
    /**
     * @dev Receive ERC20 token revenue for a pool
     * @param poolId Pool ID to receive revenue for
     * @param token Token address
     * @param amount Amount to receive
     */
    function receiveTokenRevenue(
        uint256 poolId,
        address token,
        uint256 amount
    ) external nonReentrant {
        if (poolId == 0 || !revenuePools[poolId].isActive) {
            revert PoolNotActive();
        }
        if (amount == 0) {
            revert InvalidAmount();
        }
        if (token != address(0) && !supportedTokens[token]) {
            revert UnsupportedToken();
        }
        
        RevenuePool storage pool = revenuePools[poolId];
        IERC20 tokenContract = IERC20(token);
        
        // Calculate platform fee
        uint256 platformFee = (amount * platformFeePercentage) / BASIS_POINTS;
        uint256 revenueAmount = amount - platformFee;
        
        // Transfer tokens to this contract
        tokenContract.safeTransferFrom(msg.sender, address(this), amount);
        
        // Send platform fee to treasury
        if (platformFee > 0) {
            tokenContract.safeTransfer(treasuryAddress, platformFee);
        }
        
        // Update pool revenue
        pool.totalRevenue += revenueAmount;
        
        emit RevenueReceived(poolId, msg.sender, revenueAmount, platformFee);
    }
    
    /**
     * @dev Distribute revenue to all participants in a pool
     * @param poolId Pool ID to distribute revenue for
     */
    function distributeRevenue(uint256 poolId) external nonReentrant {
        if (poolId == 0 || !revenuePools[poolId].isActive) {
            revert PoolNotActive();
        }
        
        RevenuePool storage pool = revenuePools[poolId];
        uint256 availableRevenue = pool.totalRevenue - pool.totalDistributed;
        
        if (availableRevenue == 0) {
            revert InsufficientRevenue();
        }
        
        // Distribute to all participants
        for (uint256 i = 0; i < pool.participants.length; i++) {
            address participant = pool.participants[i];
            uint256 shares = pool.shares[i];
            
            uint256 participantAmount = (availableRevenue * shares) / pool.totalShares;
            
            if (participantAmount > 0) {
                if (pool.token == address(0)) {
                    // ETH distribution
                    (bool success, ) = payable(participant).call{value: participantAmount}("");
                    if (success) {
                        participantEarnings[poolId][participant] += participantAmount;
                        pool.totalDistributed += participantAmount;
                        
                        distributionHistory[poolId].push(DistributionRecord({
                            poolId: poolId,
                            recipient: participant,
                            amount: participantAmount,
                            timestamp: block.timestamp,
                            tokenSymbol: "ETH"
                        }));
                        
                        emit RevenueDistributed(poolId, participant, participantAmount);
                    }
                } else {
                    // ERC20 token distribution
                    IERC20 tokenContract = IERC20(pool.token);
                    if (tokenContract.balanceOf(address(this)) >= participantAmount) {
                        tokenContract.safeTransfer(participant, participantAmount);
                        participantEarnings[poolId][participant] += participantAmount;
                        pool.totalDistributed += participantAmount;
                        
                        distributionHistory[poolId].push(DistributionRecord({
                            poolId: poolId,
                            recipient: participant,
                            amount: participantAmount,
                            timestamp: block.timestamp,
                            tokenSymbol: "ERC20"
                        }));
                        
                        emit RevenueDistributed(poolId, participant, participantAmount);
                    }
                }
            }
        }
    }
    
    /**
     * @dev Add participant to an existing pool
     * @param poolId Pool ID to add participant to
     * @param participant Participant address
     * @param shares Number of shares for the participant
     */
    function addParticipant(
        uint256 poolId,
        address participant,
        uint256 shares
    ) external onlyRole(OPERATOR_ROLE) {
        if (poolId == 0 || !revenuePools[poolId].isActive) {
            revert PoolNotActive();
        }
        if (participantShares[poolId][participant] > 0) {
            revert ParticipantAlreadyExists();
        }
        if (shares == 0) {
            revert InvalidShares();
        }
        
        RevenuePool storage pool = revenuePools[poolId];
        pool.participants.push(participant);
        pool.shares.push(shares);
        pool.totalShares += shares;
        
        participantShares[poolId][participant] = shares;
        
        emit ParticipantAdded(poolId, participant, shares);
    }
    
    /**
     * @dev Remove participant from a pool
     * @param poolId Pool ID to remove participant from
     * @param participant Participant address to remove
     */
    function removeParticipant(uint256 poolId, address participant) external onlyRole(OPERATOR_ROLE) {
        if (poolId == 0 || !revenuePools[poolId].isActive) {
            revert PoolNotActive();
        }
        if (participantShares[poolId][participant] == 0) {
            revert ParticipantNotFound();
        }
        
        RevenuePool storage pool = revenuePools[poolId];
        uint256 participantIndex = type(uint256).max;
        uint256 shares = participantShares[poolId][participant];
        
        // Find participant index
        for (uint256 i = 0; i < pool.participants.length; i++) {
            if (pool.participants[i] == participant) {
                participantIndex = i;
                break;
            }
        }
        
        if (participantIndex != type(uint256).max) {
            // Remove from arrays
            pool.participants[participantIndex] = pool.participants[pool.participants.length - 1];
            pool.shares[participantIndex] = pool.shares[pool.shares.length - 1];
            pool.participants.pop();
            pool.shares.pop();
            
            pool.totalShares -= shares;
            delete participantShares[poolId][participant];
            
            emit ParticipantRemoved(poolId, participant);
        }
    }
    
    /**
     * @dev Get pool information
     * @param poolId Pool ID to query
     * @return Pool data
     */
    function getPool(uint256 poolId) external view returns (RevenuePool memory) {
        if (poolId == 0) {
            revert PoolNotFound();
        }
        return revenuePools[poolId];
    }
    
    /**
     * @dev Get available revenue for distribution in a pool
     * @param poolId Pool ID to query
     * @return Available revenue amount
     */
    function getAvailableRevenue(uint256 poolId) external view returns (uint256) {
        if (poolId == 0) {
            revert PoolNotFound();
        }
        
        RevenuePool memory pool = revenuePools[poolId];
        return pool.totalRevenue - pool.totalDistributed;
    }
    
    /**
     * @dev Get participant's earnings in a pool
     * @param poolId Pool ID to query
     * @param participant Participant address
     * @return Total earnings amount
     */
    function getParticipantEarnings(uint256 poolId, address participant) external view returns (uint256) {
        return participantEarnings[poolId][participant];
    }
    
    /**
     * @dev Get distribution history for a pool
     * @param poolId Pool ID to query
     * @return Array of distribution records
     */
    function getDistributionHistory(uint256 poolId) external view returns (DistributionRecord[] memory) {
        return distributionHistory[poolId];
    }
    
    /**
     * @dev Add support for a new ERC20 token
     * @param token Token address to support
     * @param supported Whether the token is supported
     */
    function updateTokenSupport(address token, bool supported) external onlyRole(ADMIN_ROLE) {
        supportedTokens[token] = supported;
        emit TokenSupportUpdated(token, supported);
    }
    
    /**
     * @dev Update platform fee percentage
     * @param newFeePercentage New fee percentage
     */
    function updatePlatformFee(uint256 newFeePercentage) external onlyRole(ADMIN_ROLE) {
        if (newFeePercentage > MAX_FEE_PERCENTAGE) {
            revert InvalidAmount();
        }
        
        platformFeePercentage = newFeePercentage;
        emit PlatformFeeUpdated(newFeePercentage);
    }
    
    /**
     * @dev Get total number of pools
     * @return Total pools created
     */
    function totalPools() external view returns (uint256) {
        return poolCounter;
    }
    
    /**
     * @dev Get active pools count
     * @return Number of active pools
     */
    function activePools() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i <= poolCounter; i++) {
            if (revenuePools[i].isActive) {
                count++;
            }
        }
        return count;
    }
    
    /**
     * @dev Emergency withdraw function (admin only)
     * @param token Token address to withdraw (address(0) for ETH)
     * @param amount Amount to withdraw
     * @param to Recipient address
     */
    function emergencyWithdraw(
        address token,
        uint256 amount,
        address to
    ) external onlyRole(ADMIN_ROLE) nonReentrant {
        if (to == address(0)) {
            revert InvalidAmount();
        }
        
        if (token == address(0)) {
            // ETH withdrawal
            if (address(this).balance < amount) {
                revert InsufficientRevenue();
            }
            (bool success, ) = payable(to).call{value: amount}("");
            if (!success) {
                revert TransferFailed();
            }
        } else {
            // ERC20 withdrawal
            IERC20 tokenContract = IERC20(token);
            if (tokenContract.balanceOf(address(this)) < amount) {
                revert InsufficientRevenue();
            }
            tokenContract.safeTransfer(to, amount);
        }
    }
}
