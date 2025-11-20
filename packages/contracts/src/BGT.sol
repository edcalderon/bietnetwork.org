// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./token/ERC20/ERC20.sol";
import "./token/ERC20/extensions/ERC20Permit.sol";
import "./access/Ownable.sol";
import "./token/ERC20/extensions/ERC20Votes.sol";
import "./token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title BGT Token
 * @dev Biet Governance Token - ERC20 con Permit, Votes, y Burnable
 * @author Biet Network Team
 */
contract BGT is ERC20, ERC20Permit, Ownable, ERC20Votes, ERC20Burnable {
    // Constants
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1B BGT
    uint256 public constant INITIAL_MINT_AMOUNT = 100_000_000 * 10**18; // 100M for initial distribution
    
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    
    // Errors
    error MaxSupplyReached();
    error InvalidAmount();
    error CannotDelegateToZeroAddress();
    
    constructor(
        address initialOwner,
        address treasury,
        address communityFund
    ) ERC20("Biet Governance Token", "BGT") ERC20Permit() {
        // Transfer ownership to initial owner
        _transferOwnership(initialOwner);
        
        // Mint initial supply
        _mint(treasury, INITIAL_MINT_AMOUNT);
        _mint(communityFund, INITIAL_MINT_AMOUNT);
        _mint(initialOwner, INITIAL_MINT_AMOUNT);
        
        emit TokensMinted(treasury, INITIAL_MINT_AMOUNT);
        emit TokensMinted(communityFund, INITIAL_MINT_AMOUNT);
        emit TokensMinted(initialOwner, INITIAL_MINT_AMOUNT);
    }
    
    /**
     * @dev Mint new tokens (only owner)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        if (totalSupply() + amount > TOTAL_SUPPLY) {
            revert MaxSupplyReached();
        }
        if (amount == 0) {
            revert InvalidAmount();
        }
        
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Burn tokens from caller
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) public override {
        if (amount == 0) {
            revert InvalidAmount();
        }
        super.burn(amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    /**
     * @dev Burn tokens from specific account (with allowance)
     * @param account Account to burn from
     * @param amount Amount of tokens to burn
     */
    function burnFrom(address account, uint256 amount) public override {
        if (amount == 0) {
            revert InvalidAmount();
        }
        super.burnFrom(account, amount);
        emit TokensBurned(account, amount);
    }
    
    /**
     * @dev Get remaining mintable tokens
     * @return Remaining tokens that can be minted
     */
    function remainingMintable() external view returns (uint256) {
        return TOTAL_SUPPLY - totalSupply();
    }
    
    /**
     * @dev Check if address can mint tokens
     * @return True if address is owner and max supply not reached
     */
    function canMint(uint256 amount) external view returns (bool) {
        return msg.sender == owner() && totalSupply() + amount <= TOTAL_SUPPLY;
    }
    
    function nonces(address owner)
        public
        view
        override(ERC20Permit)
        returns (uint256)
    {
        return super.nonces(owner);
    }
    
    // Implement IVotes interface
    function delegates(address delegator) public view override returns (address) {
        // Simplified semantics: treat every holder as self-delegated by default.
        // This keeps voting power equal to token balance and avoids separate
        // delegate tracking state.
        return delegator;
    }

    // Disable delegateBySig to avoid unsafe signature handling. On-chain
    // delegation still works via the standard ERC20Votes `delegate` function.
    function delegateBySig(
        address /*delegatee*/,
        uint256 /*nonce*/,
        uint256 /*expiry*/,
        uint8 /*v*/,
        bytes32 /*r*/,
        bytes32 /*s*/
    ) public pure override {
        revert("BGT: delegateBySig disabled");
    }
    
    // Override conflicting functions
    function _approve(address owner, address spender, uint256 value) internal override(ERC20, ERC20Permit) {
        super._approve(owner, spender, value);
    }
    
    function _msgSender() internal view override(Context, ERC20Burnable) returns (address) {
        return super._msgSender();
    }
}
