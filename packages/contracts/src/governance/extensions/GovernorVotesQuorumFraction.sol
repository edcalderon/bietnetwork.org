// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Governor.sol";
import "../GovernorVotes.sol";

abstract contract GovernorVotesQuorumFraction is GovernorVotes {
    uint256 private _quorumNumerator;
    
    event QuorumNumeratorSet(uint256 oldQuorumNumerator, uint256 newQuorumNumerator);
    
    constructor(uint256 quorumNumeratorValue) {
        require(quorumNumeratorValue <= 100, "GovernorVotesQuorumFraction: quorum numerator over 100%");
        _setQuorumNumerator(quorumNumeratorValue);
    }
    
    function quorumNumerator() public view returns (uint256) {
        return _quorumNumerator;
    }
    
    function quorumDenominator() public pure virtual returns (uint256) {
        return 100;
    }
    
    function quorum(uint256 blockNumber) public view virtual returns (uint256) {
        return (votingToken().getPastTotalSupply(blockNumber) * quorumNumerator()) / quorumDenominator();
    }
    
    function updateQuorumNumerator(uint256 newQuorumNumerator) external virtual {
        // This function should be overridden in the final contract to implement proper access control
        require(newQuorumNumerator <= quorumDenominator(), "GovernorVotesQuorumFraction: quorum numerator over denominator");
        
        uint256 oldQuorumNumerator = _quorumNumerator;
        _setQuorumNumerator(newQuorumNumerator);
        emit QuorumNumeratorSet(oldQuorumNumerator, newQuorumNumerator);
    }
    
    function _setQuorumNumerator(uint256 newQuorumNumerator) internal {
        _quorumNumerator = newQuorumNumerator;
    }
    
    function owner() public view virtual returns (address) {
        return address(0); // Override in implementation
    }
}
