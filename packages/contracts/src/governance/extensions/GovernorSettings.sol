// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Governor.sol";

abstract contract GovernorSettings is Governor {
    uint256 private _votingDelay;
    uint256 private _votingPeriod;
    uint256 private _proposalThreshold;
    
    event VotingDelaySet(uint256 oldVotingDelay, uint256 newVotingDelay);
    event VotingPeriodSet(uint256 oldVotingPeriod, uint256 newVotingPeriod);
    event ProposalThresholdSet(uint256 oldProposalThreshold, uint256 newProposalThreshold);
    
    constructor(uint256 votingDelay_, uint256 votingPeriod_, uint256 proposalThreshold_) {
        _setVotingDelay(votingDelay_);
        _setVotingPeriod(votingPeriod_);
        _setProposalThreshold(proposalThreshold_);
    }
    
    function votingDelay() public view virtual override returns (uint256) {
        return _votingDelay;
    }
    
    function votingPeriod() public view virtual override returns (uint256) {
        return _votingPeriod;
    }
    
    function proposalThreshold() public view virtual returns (uint256) {
        return _proposalThreshold;
    }
    
    function setVotingDelay(uint256 newVotingDelay) external virtual {
        require(msg.sender == owner(), "GovernorSettings: only owner can set voting delay");
        uint256 oldVotingDelay = _votingDelay;
        _setVotingDelay(newVotingDelay);
        emit VotingDelaySet(oldVotingDelay, newVotingDelay);
    }
    
    function setVotingPeriod(uint256 newVotingPeriod) external virtual {
        require(msg.sender == owner(), "GovernorSettings: only owner can set voting period");
        uint256 oldVotingPeriod = _votingPeriod;
        _setVotingPeriod(newVotingPeriod);
        emit VotingPeriodSet(oldVotingPeriod, newVotingPeriod);
    }
    
    function setProposalThreshold(uint256 newProposalThreshold) external virtual {
        require(msg.sender == owner(), "GovernorSettings: only owner can set proposal threshold");
        uint256 oldProposalThreshold = _proposalThreshold;
        _setProposalThreshold(newProposalThreshold);
        emit ProposalThresholdSet(oldProposalThreshold, newProposalThreshold);
    }
    
    function _setVotingDelay(uint256 newVotingDelay) internal {
        require(newVotingDelay < votingPeriod(), "GovernorSettings: voting delay must be less than voting period");
        _votingDelay = newVotingDelay;
    }
    
    function _setVotingPeriod(uint256 newVotingPeriod) internal {
        require(newVotingPeriod > votingDelay(), "GovernorSettings: voting period must be greater than voting delay");
        _votingPeriod = newVotingPeriod;
    }
    
    function _setProposalThreshold(uint256 newProposalThreshold) internal {
        _proposalThreshold = newProposalThreshold;
    }
    
    function owner() internal view virtual returns (address) {
        return address(0); // Override in implementation
    }
}
