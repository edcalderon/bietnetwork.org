// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./token/ERC721/ERC721.sol";
import "./access/AccessControl.sol";
import "./access/Ownable.sol";
import "./utils/Counters.sol";
import "./utils/cryptography/ECDSA.sol";
import "./utils/cryptography/MessageHashUtils.sol";
import "./proxy/utils/Initializable.sol";

/**
 * @title Biet Identity
 * @dev Soulbound Token para identidad verificada en Red Biet
 * @author Biet Network Team
 */
contract BietIdentity is ERC721, AccessControl, Initializable, Ownable {
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
    // Nonces for replay protection
    mapping(address => uint256) public mintNonces;
    mapping(uint256 => uint256) public updateNonces;
    
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
    error InvalidAddress();
    
    constructor(address admin, address verifier, uint256 fee) ERC721("Biet Identity", "BIETID") Ownable() {
        if (admin == address(0) || verifier == address(0)) {
            revert InvalidAddress();
        }
        
        _transferOwnership(admin);
        _grantRole(VERIFIER_ROLE, verifier);
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        verificationFee = fee;
        
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
        
        // Verify signature with per-address nonce for replay protection
        uint256 nonce = mintNonces[to];
        bytes32 identityHash = keccak256(abi.encodePacked(to, name, did, country, verificationLevel, nonce));
        if (usedHashes[identityHash]) {
            revert IdentityHashAlreadyUsed();
        }
        
        bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", identityHash));
        address recoveredSigner = recoverSigner(messageHash, signature);
        
        if (!hasRole(VERIFIER_ROLE, recoveredSigner)) {
            revert InvalidSignature();
        }
        
        // Mint token starting from ID 1 so that "0" can safely represent
        // "no identity" in addressToTokenId.
        uint256 tokenId = _tokenIdCounter.current() + 1;
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
        mintNonces[to] = nonce + 1;
        
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
        if (ownerOf(tokenId) != msg.sender) {
            revert UnauthorizedAccess();
        }
        
        Identity storage identity = identities[tokenId];
        
        // Verify signature for update with per-token nonce for replay protection
        uint256 nonce = updateNonces[tokenId];
        bytes32 updateHash = keccak256(abi.encodePacked(tokenId, name, verificationLevel, nonce));
        bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", updateHash));
        address recoveredSigner = recoverSigner(messageHash, signature);
        
        if (!hasRole(VERIFIER_ROLE, recoveredSigner)) {
            revert InvalidSignature();
        }
        
        identity.name = name;
        identity.verificationLevel = verificationLevel;
        updateNonces[tokenId] = nonce + 1;
        
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
        returns (bool)
    {
        // Basic implementation for ERC721 and AccessControl
        return interfaceId == 0x80ac58cd || // ERC721
               interfaceId == 0x5b5e139f || // ERC721Metadata
               interfaceId == 0x7965db0b;  // AccessControl
    }
    
    /**
     * @dev Recover signer address from message hash and signature
     */
    function recoverSigner(bytes32 messageHash, bytes memory signature) internal pure returns (address) {
        if (signature.length != 65) {
            return address(0);
        }
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        
        if (v < 27) {
            v += 27;
        }
        
        if (v != 27 && v != 28) {
            return address(0);
        }
        
        return ecrecover(messageHash, v, r, s);
    }
}
