// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../ERC20.sol";
import "../../../utils/cryptography/ECDSA.sol";
import "../../../utils/cryptography/MessageHashUtils.sol";
import "../../../utils/Counters.sol";

abstract contract ERC20Permit {
    using Counters for Counters.Counter;
    
    mapping(address => Counters.Counter) private _nonces;
    
    bytes32 private constant _PERMIT_TYPEHASH =
        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
    
    bytes32 private immutable _DOMAIN_SEPARATOR;
    
    constructor() {
        _DOMAIN_SEPARATOR = _buildDomainSeparator();
    }
    
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual {
        require(block.timestamp <= deadline, "ERC20Permit: expired deadline");
        
        bytes32 structHash = keccak256(
            abi.encode(_PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline)
        );
        
        bytes32 hash = MessageHashUtils.toTypedDataHash(_DOMAIN_SEPARATOR, structHash);
        
        address signer = ECDSA.recover(hash, v, r, s);
        require(signer == owner, "ERC20Permit: invalid signature");
        
        _approve(owner, spender, value);
    }
    
    function nonces(address owner) public view virtual returns (uint256) {
        return _nonces[owner].current();
    }
    
    function DOMAIN_SEPARATOR() external view returns (bytes32) {
        return _DOMAIN_SEPARATOR;
    }
    
    function _useNonce(address owner) internal returns (uint256 current) {
        Counters.Counter storage nonce = _nonces[owner];
        current = nonce.current();
        nonce.increment();
    }
    
    function _buildDomainSeparator() private view returns (bytes32) {
        return keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("Biet Governance Token")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }
    
    function _approve(address owner, address spender, uint256 value) internal virtual;
}
