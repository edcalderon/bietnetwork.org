// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./token/ERC721/ERC721.sol";
import "./token/ERC721/extensions/ERC721URIStorage.sol";
import "./access/AccessControl.sol";
import "./utils/Counters.sol";
import "./finance/PaymentSplitter.sol";
import "./token/ERC20/IERC20.sol";
import "./token/ERC20/utils/SafeERC20.sol";
import "./proxy/utils/Initializable.sol";

/**
 * @title ProductiveUnit
 * @dev Contrato para unidades productivas (Biets) en Red Biet
 * @author Biet Network Team
 */
contract ProductiveUnit is ERC721, ERC721URIStorage, AccessControl, PaymentSplitter, Initializable {
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;
    
    // Roles
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    // Constants
    uint256 public constant MAX_ROYALTY_PERCENTAGE = 1000; // 10% in basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    // State variables
    Counters.Counter private _tokenIdCounter;
    address public bgtToken;
    address public identityContract;
    address public treasuryAddress;
    uint256 public platformFeePercentage;
    
    // Productive Unit data structures
    struct Biet {
        string name;
        string description;
        string category;
        address creator;
        uint256 createdAt;
        uint256 royaltyPercentage;
        bool isActive;
        uint256 totalRevenue;
        uint256 totalDistributed;
        string location;
        string[] tags;
    }
    
    // Revenue tracking
    struct RevenueRecord {
        uint256 amount;
        uint256 timestamp;
        address payer;
        string currency; // "ETH", "BGT", "USDC", etc.
    }
    
    // Mappings
    mapping(uint256 => Biet) public biets;
    mapping(uint256 => RevenueRecord[]) public revenueHistory;
    mapping(uint256 => mapping(address => bool)) public authorizedOperators;
    mapping(string => bool) public categoryExists;
    
    // Events
    event BietCreated(
        uint256 indexed tokenId,
        address indexed creator,
        string name,
        string category,
        uint256 royaltyPercentage
    );
    event BietUpdated(
        uint256 indexed tokenId,
        string name,
        string description
    );
    event RevenueReceived(
        uint256 indexed tokenId,
        address indexed payer,
        uint256 amount,
        string currency
    );
    event RevenueDistributed(
        uint256 indexed tokenId,
        address indexed recipient,
        uint256 amount
    );
    event OperatorAuthorized(
        uint256 indexed tokenId,
        address indexed operator
    );
    event OperatorRevoked(
        uint256 indexed tokenId,
        address indexed operator
    );
    
    // Errors
    error UnauthorizedAccess();
    error InvalidTokenId();
    error InvalidRoyaltyPercentage();
    error BietNotActive();
    error InvalidAddress();
    error InsufficientPayment();
    error TransferFailed();
    error CategoryAlreadyExists();
    error CategoryNotFound();
    
    constructor() ERC721("Biet Productive Unit", "BIET") PaymentSplitter(new address[](0), new uint256[](0)) {
        _disableInitializers();
    }
    
    /**
     * @dev Initialize the productive unit contract
     * @param admin Initial admin address
     * @param _bgtToken BGT token address
     * @param _identityContract Identity contract address
     * @param _treasuryAddress Treasury address
     * @param feePercentage Platform fee percentage
     */
    function initialize(
        address admin,
        address _bgtToken,
        address _identityContract,
        address _treasuryAddress,
        uint256 feePercentage
    ) public initializer {
        if (admin == address(0) || _bgtToken == address(0) || _identityContract == address(0)) {
            revert InvalidAddress();
        }
        
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(CREATOR_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
        
        bgtToken = _bgtToken;
        identityContract = _identityContract;
        treasuryAddress = _treasuryAddress;
        platformFeePercentage = feePercentage;
        
        // Initialize default categories
        _createDefaultCategories();
    }
    
    /**
     * @dev Create a new Biet (Productive Unit)
     * @param creator Address of the creator
     * @param name Name of the Biet
     * @param description Description of the Biet
     * @param category Category of the Biet
     * @param royaltyPercentage Royalty percentage for revenue sharing
     * @param metadataURI Metadata URI
     * @param location Physical location
     * @param tags Array of tags
     */
    function createBiet(
        address creator,
        string memory name,
        string memory description,
        string memory category,
        uint256 royaltyPercentage,
        string memory metadataURI,
        string memory location,
        string[] memory tags
    ) external onlyRole(CREATOR_ROLE) returns (uint256) {
        if (royaltyPercentage > MAX_ROYALTY_PERCENTAGE) {
            revert InvalidRoyaltyPercentage();
        }
        if (!categoryExists[category]) {
            revert CategoryNotFound();
        }
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(creator, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        // Store Biet data
        biets[tokenId] = Biet({
            name: name,
            description: description,
            category: category,
            creator: creator,
            createdAt: block.timestamp,
            royaltyPercentage: royaltyPercentage,
            isActive: true,
            totalRevenue: 0,
            totalDistributed: 0,
            location: location,
            tags: tags
        });
        
        // Set up payment splitting for this Biet
        address[] memory payees = new address[](2);
        payees[0] = creator;
        payees[1] = treasuryAddress;
        
        uint256[] memory shares = new uint256[](2);
        shares[0] = MAX_ROYALTY_PERCENTAGE - royaltyPercentage; // Creator share
        shares[1] = royaltyPercentage; // Platform share
        
        _setPayeesForToken(tokenId, payees, shares);
        
        emit BietCreated(tokenId, creator, name, category, royaltyPercentage);
        
        return tokenId;
    }
    
    /**
     * @dev Update Biet information
     * @param tokenId Token ID to update
     * @param name New name
     * @param description New description
     */
    function updateBiet(
        uint256 tokenId,
        string memory name,
        string memory description
    ) external {
        if (!_exists(tokenId)) {
            revert InvalidTokenId();
        }
        
        Biet storage biet = biets[tokenId];
        if (msg.sender != biet.creator && !hasRole(ADMIN_ROLE, msg.sender)) {
            revert UnauthorizedAccess();
        }
        
        biet.name = name;
        biet.description = description;
        
        emit BietUpdated(tokenId, name, description);
    }
    
    /**
     * @dev Receive ETH payment for a Biet
     * @param tokenId Token ID of the Biet
     */
    function receivePayment(uint256 tokenId) external payable {
        if (!_exists(tokenId)) {
            revert InvalidTokenId();
        }
        
        Biet storage biet = biets[tokenId];
        if (!biet.isActive) {
            revert BietNotActive();
        }
        
        if (msg.value == 0) {
            revert InsufficientPayment();
        }
        
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
        
        // Update revenue tracking
        biet.totalRevenue += revenueAmount;
        revenueHistory[tokenId].push(RevenueRecord({
            amount: revenueAmount,
            timestamp: block.timestamp,
            payer: msg.sender,
            currency: "ETH"
        }));
        
        emit RevenueReceived(tokenId, msg.sender, revenueAmount, "ETH");
    }
    
    /**
     * @dev Receive ERC20 token payment for a Biet
     * @param tokenId Token ID of the Biet
     * @param token Token address
     * @param amount Amount to pay
     */
    function receiveTokenPayment(
        uint256 tokenId,
        address token,
        uint256 amount
    ) external {
        if (!_exists(tokenId)) {
            revert InvalidTokenId();
        }
        
        Biet storage biet = biets[tokenId];
        if (!biet.isActive) {
            revert BietNotActive();
        }
        
        if (amount == 0) {
            revert InsufficientPayment();
        }
        
        IERC20 tokenContract = IERC20(token);
        
        // Calculate platform fee
        uint256 platformFee = (amount * platformFeePercentage) / BASIS_POINTS;
        uint256 revenueAmount = amount - platformFee;
        
        // Transfer tokens
        tokenContract.safeTransferFrom(msg.sender, address(this), amount);
        
        // Send platform fee to treasury
        if (platformFee > 0) {
            tokenContract.safeTransfer(treasuryAddress, platformFee);
        }
        
        // Update revenue tracking
        biet.totalRevenue += revenueAmount;
        revenueHistory[tokenId].push(RevenueRecord({
            amount: revenueAmount,
            timestamp: block.timestamp,
            payer: msg.sender,
            currency: "ERC20"
        }));
        
        emit RevenueReceived(tokenId, msg.sender, revenueAmount, "ERC20");
    }
    
    /**
     * @dev Distribute revenue to stakeholders
     * @param tokenId Token ID of the Biet
     */
    function distributeRevenue(uint256 tokenId) external {
        if (!_exists(tokenId)) {
            revert InvalidTokenId();
        }
        
        Biet storage biet = biets[tokenId];
        address creator = biet.creator;
        
        // This is a simplified distribution logic
        // In practice, you'd want more sophisticated revenue sharing
        uint256 availableRevenue = biet.totalRevenue - biet.totalDistributed;
        
        if (availableRevenue > 0) {
            // Calculate creator's share
            uint256 creatorShare = (availableRevenue * (MAX_ROYALTY_PERCENTAGE - biet.royaltyPercentage)) / MAX_ROYALTY_PERCENTAGE;
            
            if (address(this).balance >= creatorShare) {
                (bool success, ) = payable(creator).call{value: creatorShare}("");
                if (success) {
                    biet.totalDistributed += creatorShare;
                    emit RevenueDistributed(tokenId, creator, creatorShare);
                }
            }
        }
    }
    
    /**
     * @dev Authorize operator for a Biet
     * @param tokenId Token ID of the Biet
     * @param operator Address to authorize
     */
    function authorizeOperator(uint256 tokenId, address operator) external {
        if (!_exists(tokenId)) {
            revert InvalidTokenId();
        }
        
        Biet storage biet = biets[tokenId];
        if (msg.sender != biet.creator && !hasRole(ADMIN_ROLE, msg.sender)) {
            revert UnauthorizedAccess();
        }
        
        authorizedOperators[tokenId][operator] = true;
        emit OperatorAuthorized(tokenId, operator);
    }
    
    /**
     * @dev Revoke operator authorization
     * @param tokenId Token ID of the Biet
     * @param operator Address to revoke
     */
    function revokeOperator(uint256 tokenId, address operator) external {
        if (!_exists(tokenId)) {
            revert InvalidTokenId();
        }
        
        Biet storage biet = biets[tokenId];
        if (msg.sender != biet.creator && !hasRole(ADMIN_ROLE, msg.sender)) {
            revert UnauthorizedAccess();
        }
        
        authorizedOperators[tokenId][operator] = false;
        emit OperatorRevoked(tokenId, operator);
    }
    
    /**
     * @dev Create new category
     * @param category Category name
     */
    function createCategory(string memory category) external onlyRole(ADMIN_ROLE) {
        if (categoryExists[category]) {
            revert CategoryAlreadyExists();
        }
        categoryExists[category] = true;
    }
    
    /**
     * @dev Get Biet information
     * @param tokenId Token ID to query
     * @return Biet data
     */
    function getBiet(uint256 tokenId) external view returns (Biet memory) {
        if (!_exists(tokenId)) {
            revert InvalidTokenId();
        }
        return biets[tokenId];
    }
    
    /**
     * @dev Get revenue history for a Biet
     * @param tokenId Token ID to query
     * @return Array of revenue records
     */
    function getRevenueHistory(uint256 tokenId) external view returns (RevenueRecord[] memory) {
        return revenueHistory[tokenId];
    }
    
    /**
     * @dev Check if address is authorized operator for Biet
     * @param tokenId Token ID to check
     * @param operator Address to check
     * @return True if authorized
     */
    function isAuthorizedOperator(uint256 tokenId, address operator) external view returns (bool) {
        return authorizedOperators[tokenId][operator];
    }
    
    /**
     * @dev Get total revenue for a Biet
     * @param tokenId Token ID to query
     * @return Total revenue amount
     */
    function getTotalRevenue(uint256 tokenId) external view returns (uint256) {
        if (!_exists(tokenId)) {
            revert InvalidTokenId();
        }
        return biets[tokenId].totalRevenue;
    }
    
    /**
     * @dev Get available revenue for distribution
     * @param tokenId Token ID to query
     * @return Available revenue amount
     */
    function getAvailableRevenue(uint256 tokenId) external view returns (uint256) {
        if (!_exists(tokenId)) {
            revert InvalidTokenId();
        }
        
        Biet memory biet = biets[tokenId];
        return biet.totalRevenue - biet.totalDistributed;
    }
    
    /**
     * @dev Get total number of Biets
     * @return Total Biets created
     */
    function totalBiets() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Get active Biets count
     * @return Number of active Biets
     */
    function activeBiets() external view returns (uint256) {
        uint256 count = 0;
        uint256 total = _tokenIdCounter.current();
        
        for (uint256 i = 1; i <= total; i++) {
            if (biets[i].isActive) {
                count++;
            }
        }
        
        return count;
    }
    
    /**
     * @dev Update platform fee percentage
     * @param newFeePercentage New fee percentage
     */
    function updatePlatformFee(uint256 newFeePercentage) external onlyRole(ADMIN_ROLE) {
        platformFeePercentage = newFeePercentage;
    }
    
    /**
     * @dev Internal function to create default categories
     */
    function _createDefaultCategories() internal {
        categoryExists["agricultura"] = true;
        categoryExists["tecnologia"] = true;
        categoryExists["educacion"] = true;
        categoryExists["salud"] = true;
        categoryExists["energia"] = true;
        categoryExists["manufactura"] = true;
        categoryExists["servicios"] = true;
        categoryExists["turismo"] = true;
    }
    
    /**
     * @dev Internal function to set payees for specific token
     */
    function _setPayeesForToken(
        uint256 tokenId,
        address[] memory payees,
        uint256[] memory shares
    ) internal {
        // This would require custom implementation in PaymentSplitter
        // For now, we'll store the data and handle distribution manually
    }
    
    /**
     * @dev Required overrides
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Internal function to check if token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId <= _tokenIdCounter.current() && _ownerOf(tokenId) != address(0);
    }
}
