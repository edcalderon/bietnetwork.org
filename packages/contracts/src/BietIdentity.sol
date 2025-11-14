// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./token/ERC721/ERC721.sol";
import "./access/AccessControl.sol";
import "./utils/Counters.sol";
import "./utils/cryptography/ECDSA.sol";
import "./utils/cryptography/MessageHashUtils.sol";
import "./proxy/utils/Initializable.sol";

/**
 * @title Biet Identity
 * @dev Soulbound Token para identidad verificada en Red Biet
 * @author Biet Network Team
 */
contract BietIdentity is ERC721, AccessControl, Initializable {
    using Counters for Counters.Counter;
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;
    
    // Roles
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    // State variables
    Counters.Counter private _tokenIdCounter;
    address public verifierAddress;
    uint256 public verificationFee;
    
    // Identity data structures
    struct Identity {
        string name;
        string did;
        string country;
        string verificationLevel; // "basic", "verified", "premium"
        uint256 createdAt;
        bool isActive;
        bytes32 identityHash;
    }
    
    // Mappings
    mapping(uint256 => Identity) public identities;
    mapping(address => uint256) public addressToTokenId;
    mapping(bytes32 => bool) public usedHashes;
    mapping(string => bool) public didExists;
    
    // Events
    event IdentityMinted(
        address indexed to,
        uint256 indexed tokenId,
        string name,
        string did,
        string verificationLevel
    );
    event IdentityUpdated(
        uint256 indexed tokenId,
        string name,
        string verificationLevel
    );
    event IdentityRevoked(uint256 indexed tokenId);
    event VerificationFeeUpdated(uint256 newFee);
    event VerifierUpdated(address indexed newVerifier);
    
    // Errors
    error IdentityAlreadyExists();
    error InvalidSignature();
    error InsufficientFee();
    error UnauthorizedAccess();
    error IdentityNotFound();
    error InvalidTokenId();
    error SoulboundTransfer();
    error DIDAlreadyExists();
    error IdentityHashAlreadyUsed();
    
    constructor() ERC721("Biet Identity", "BIETID") {
        _disableInitializers();
    }
    
    /**
     * @dev Initialize the identity contract
     * @param admin Initial admin address
     * @param verifier Initial verifier address
     * @param fee Verification fee amount
     */
    function initialize(
        address admin,
        address verifier,
        uint256 fee
    ) public initializer {
        if (admin == address(0) || verifier == address(0)) {
            revert InvalidAddress();
        }
        
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
        _grantRole(VERIFIER_ROLE, verifier);
        
        verifierAddress = verifier;
        verificationFee = fee;
    }
    
    /**
     * @dev Mint identity token (soulbound)
     * @param to Address to mint identity to
     * @param name Identity holder name
     * @param did Decentralized identifier
     * @param country Country code
     * @param verificationLevel Initial verification level
     * @param signature Verifier signature
     */
    function mintIdentity(
        address to,
        string memory name,
        string memory did,
        string memory country,
        string memory verificationLevel,
        bytes memory signature
    ) external payable {
        if (addressToTokenId[to] != 0) {
            revert IdentityAlreadyExists();
        }
        if (didExists[did]) {
            revert DIDAlreadyExists();
        }
        if (msg.value < verificationFee) {
            revert InsufficientFee();
        }
        
        // Verify signature
        bytes32 identityHash = keccak256(abi.encodePacked(to, name, did, country, verificationLevel));
        if (usedHashes[identityHash]) {
            revert IdentityHashAlreadyUsed();
        }
        
        bytes32 messageHash = identityHash.toEthSignedMessageHash();
        address recoveredSigner = messageHash.recover(signature);
        
        if (!hasRole(VERIFIER_ROLE, recoveredSigner)) {
            revert InvalidSignature();
        }
        
        // Mint token
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        
        // Store identity data
        identities[tokenId] = Identity({
            name: name,
            did: did,
            country: country,
            verificationLevel: verificationLevel,
            createdAt: block.timestamp,
            isActive: true,
            identityHash: identityHash
        });
        
        addressToTokenId[to] = tokenId;
        usedHashes[identityHash] = true;
        didExists[did] = true;
        
        emit IdentityMinted(to, tokenId, name, did, verificationLevel);
        
        // Return excess fee
        if (msg.value > verificationFee) {
            payable(to).transfer(msg.value - verificationFee);
        }
    }
    
    /**
     * @dev Update identity information
     * @param tokenId Token ID to update
     * @param name New name
     * @param verificationLevel New verification level
     * @param signature Verifier signature
     */
    function updateIdentity(
        uint256 tokenId,
        string memory name,
        string memory verificationLevel,
        bytes memory signature
    ) external {
        if (!_ownerOf(tokenId) != msg.sender) {
            revert UnauthorizedAccess();
        }
        
        Identity storage identity = identities[tokenId];
        
        // Verify signature for update
        bytes32 updateHash = keccak256(abi.encodePacked(tokenId, name, verificationLevel, block.timestamp));
        bytes32 messageHash = updateHash.toEthSignedMessageHash();
        address recoveredSigner = messageHash.recover(signature);
        
        if (!hasRole(VERIFIER_ROLE, recoveredSigner)) {
            revert InvalidSignature();
        }
        
        identity.name = name;
        identity.verificationLevel = verificationLevel;
        
        emit IdentityUpdated(tokenId, name, verificationLevel);
    }
    
    /**
     * @dev Revoke identity (admin only)
     * @param tokenId Token ID to revoke
     */
    function revokeIdentity(uint256 tokenId) external onlyRole(ADMIN_ROLE) {
        if (!_exists(tokenId)) {
            revert InvalidTokenId();
        }
        
        Identity storage identity = identities[tokenId];
        identity.isActive = false;
        
        emit IdentityRevoked(tokenId);
    }
    
    /**
     * @dev Get identity by token ID
     * @param tokenId Token ID to query
     * @return Identity data
     */
    function getIdentity(uint256 tokenId) external view returns (Identity memory) {
        if (!_exists(tokenId)) {
            revert IdentityNotFound();
        }
        return identities[tokenId];
    }
    
    /**
     * @dev Get identity by address
     * @param account Address to query
     * @return Identity data
     */
    function getIdentityByAddress(address account) external view returns (Identity memory) {
        uint256 tokenId = addressToTokenId[account];
        if (tokenId == 0) {
            revert IdentityNotFound();
        }
        return identities[tokenId];
    }
    
    /**
     * @dev Check if address has verified identity
     * @param account Address to check
     * @return True if has verified identity
     */
    function hasVerifiedIdentity(address account) external view returns (bool) {
        uint256 tokenId = addressToTokenId[account];
        if (tokenId == 0) return false;
        
        Identity memory identity = identities[tokenId];
        return identity.isActive && 
               (keccak256(bytes(identity.verificationLevel)) == keccak256(bytes("verified")) ||
                keccak256(bytes(identity.verificationLevel)) == keccak256(bytes("premium")));
    }
    
    /**
     * @dev Get verification level of address
     * @param account Address to check
     * @return Verification level string
     */
    function getVerificationLevel(address account) external view returns (string memory) {
        uint256 tokenId = addressToTokenId[account];
        if (tokenId == 0) return "none";
        
        return identities[tokenId].verificationLevel;
    }
    
    /**
     * @dev Update verification fee
     * @param newFee New verification fee amount
     */
    function updateVerificationFee(uint256 newFee) external onlyRole(ADMIN_ROLE) {
        verificationFee = newFee;
        emit VerificationFeeUpdated(newFee);
    }
    
    /**
     * @dev Update verifier address
     * @param newVerifier New verifier address
     */
    function updateVerifier(address newVerifier) external onlyRole(ADMIN_ROLE) {
        if (newVerifier == address(0)) {
            revert InvalidAddress();
        }
        
        verifierAddress = newVerifier;
        emit VerifierUpdated(newVerifier);
    }
    
    /**
     * @dev Get total number of identities
     * @return Total identities minted
     */
    function totalIdentities() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Get active identities count
     * @return Number of active identities
     */
    function activeIdentities() external view returns (uint256) {
        uint256 count = 0;
        uint256 total = _tokenIdCounter.current();
        
        for (uint256 i = 1; i <= total; i++) {
            if (identities[i].isActive) {
                count++;
            }
        }
        
        return count;
    }
    
    /**
     * @dev Override transfer functions to make tokens soulbound
     */
    function transferFrom(address, address, uint256) public pure override {
        revert SoulboundTransfer();
    }
    
    function safeTransferFrom(address, address, uint256) public pure override {
        revert SoulboundTransfer();
    }
    
    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert SoulboundTransfer();
    }
    
    /**
     * @dev Override approve functions (not needed for soulbound tokens)
     */
    function approve(address, uint256) public pure override {
        revert SoulboundTransfer();
    }
    
    function setApprovalForAll(address, bool) public pure override {
        revert SoulboundTransfer();
    }
    
    /**
     * @dev Required overrides
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Internal function to check if token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId <= _tokenIdCounter.current();
    }
    
    /**
     * @dev Internal function to get owner of token
     */
    function _ownerOf(uint256 tokenId) internal view override returns (address) {
        address owner = ownerOf(tokenId);
        return owner;
    }
}
