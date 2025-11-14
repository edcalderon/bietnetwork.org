// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Governor.sol";

abstract contract GovernorCountingSimple is Governor {
    function hasVoted(uint256 proposalId, address account) public view virtual override returns (bool) {
        return _getVote(proposalId, account).hasVoted;
    }
    
    function _countVote(
        uint256 proposalId,
        address account,
        uint8 support,
        uint256 weight
    ) internal virtual override {
        require(!hasVoted(proposalId, account), "GovernorCountingSimple: vote already cast");
        require(support <= 2, "GovernorCountingSimple: invalid vote type");
        
        _getVote(proposalId, account).hasVoted = true;
        _getVote(proposalId, account).support = support;
        _getVote(proposalId, account).weight = weight;
        
        super._countVote(proposalId, account, support, weight);
    }
    
    struct VoteReceipt {
        bool hasVoted;
        uint8 support;
        uint256 weight;
    }
    
    mapping(uint256 => mapping(address => VoteReceipt)) private _votes;
    
    function _getVote(uint256 proposalId, address account) private view returns (VoteReceipt storage) {
        return _votes[proposalId][account];
    }
}
