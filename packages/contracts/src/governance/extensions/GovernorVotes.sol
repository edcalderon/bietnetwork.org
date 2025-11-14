// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Governor.sol";
import "../../interfaces/IVotes.sol";

abstract contract GovernorVotes is Governor {
    IVotes private _token;
    
    event VotingTokenSet(address oldVotingToken, address newVotingToken);
    
    constructor(IVotes token_) {
        _setVotingToken(token_);
    }
    
    function votingToken() public view returns (IVotes) {
        return _token;
    }
    
    function getVotes(address account, uint256 blockNumber) public view virtual override returns (uint256) {
        return _token.getPastVotes(account, blockNumber);
    }
    
    function _setVotingToken(IVotes newToken) internal {
        address oldToken = address(_token);
        _token = newToken;
        emit VotingTokenSet(oldToken, address(newToken));
    }
}
