// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IVotes.sol";
import "./interfaces/ITimelock.sol";
import "./governance/Governor.sol";
import "./governance/extensions/GovernorSettings.sol";
import "./governance/extensions/GovernorCountingSimple.sol";
import "./governance/extensions/GovernorVotesQuorumFraction.sol";
import "./access/Ownable.sol";

/**
 * @title BGT DAO
 * @dev Gobernanza descentralizada para Red Biet
 * @author Biet Network Team
 */
contract BGTDAO is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotesQuorumFraction, Ownable {
    // Constants
    uint256 public constant VOTING_PERIOD = 7 days; // 7 días para votar
    uint256 public constant VOTING_DELAY = 1 days; // 1 día antes de poder votar
    uint256 public constant PROPOSAL_THRESHOLD = 1_000_000 * 10**18; // 1M BGT
    uint256 public constant QUORUM_PERCENTAGE = 4; // 4% del supply total
    uint256 public constant TIMELOCK_DELAY = 2 days; // 2 días para ejecución
    
    // State
    ITimelock public timelock;
    
    // Events
    event ProposalCreatedWithMetadata(
        uint256 indexed proposalId,
        address indexed proposer,
        string metadata,
        uint256 startBlock,
        uint256 endBlock
    );
    
    event ProposalExecutedWithResults(
        uint256 indexed proposalId,
        bool success,
        bytes[] results
    );
    
    // Errors
    error ProposalAlreadyExists();
    error InvalidProposalData();
    error VotingNotStarted();
    error VotingEnded();
    error InsufficientVotingPower();
    
    constructor(
        IVotes _token,
        ITimelock _timelock,
        address initialOwner
    )
        Governor("Biet Network DAO")
        GovernorVotes(_token)
        GovernorSettings(VOTING_DELAY, VOTING_PERIOD, PROPOSAL_THRESHOLD)
        GovernorVotesQuorumFraction(QUORUM_PERCENTAGE)
        Ownable(initialOwner)
    {
        timelock = _timelock;
    }
    
    /**
     * @dev Create proposal with metadata
     * @param targets Target addresses for the proposal
     * @param values ETH values for each target
     * @param calldatas Function calldata for each target
     * @param description Description of the proposal
     * @param metadata IPFS hash or additional metadata
     * @return proposalId ID of the created proposal
     */
    function proposeWithMetadata(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        string memory metadata
    ) public returns (uint256 proposalId) {
        if (targets.length == 0) {
            revert InvalidProposalData();
        }
        if (targets.length != values.length || targets.length != calldatas.length) {
            revert InvalidProposalData();
        }
        
        proposalId = propose(targets, values, calldatas, description);
        
        uint256 startBlock = proposalSnapshot(proposalId);
        uint256 endBlock = proposalDeadline(proposalId);
        
        emit ProposalCreatedWithMetadata(proposalId, msg.sender, metadata, startBlock, endBlock);
        
        return proposalId;
    }
    
    /**
     * @dev Execute proposal and emit detailed results
     * @param proposalId ID of the proposal to execute
     */
    function executeWithResults(uint256 proposalId) public payable {
        address[] memory targets = proposalTargets(proposalId);
        uint256[] memory values = proposalValues(proposalId);
        bytes[] memory calldatas = proposalCalldatas(proposalId);
        
        // Execute the proposal
        super.execute(targets, values, calldatas, keccak256(bytes(proposalDescription(proposalId))));
        
        // Get execution results
        bytes[] memory results = new bytes[](targets.length);
        bool success = true;
        
        for (uint256 i = 0; i < targets.length; i++) {
            (bool result, ) = targets[i].call{value: values[i]}(calldatas[i]);
            results[i] = abi.encode(result);
            if (!result) {
                success = false;
            }
        }
        
        emit ProposalExecutedWithResults(proposalId, success, results);
    }
    
    /**
     * @dev Get proposal voting power at specific block
     * @param account Account to check voting power for
     * @param blockNumber Block number to check at
     * @return Voting power at the specified block
     */
    function getVotes(address account, uint256 blockNumber) public view override(Governor, GovernorVotes) returns (uint256) {
        return votingToken().getPastVotes(account, blockNumber);
    }
    
    /**
     * @dev Check if account can vote on proposal
     * @param account Account to check
     * @param proposalId Proposal ID to check
     * @return True if account can vote
     */
    function canVote(address account, uint256 proposalId) public view returns (bool) {
        uint256 snapshot = proposalSnapshot(proposalId);
        uint256 deadline = proposalDeadline(proposalId);
        uint256 currentBlock = block.number;
        
        if (currentBlock < snapshot) {
            return false; // Voting not started
        }
        
        if (currentBlock > deadline) {
            return false; // Voting ended
        }
        
        uint256 votingPower = getVotes(account, snapshot);
        return votingPower > 0;
    }
    
    /**
     * @dev Get proposal status with detailed information
     * @param proposalId Proposal ID to check
     * @return status Current proposal status
     * @return forVotes Votes in favor
     * @return againstVotes Votes against
     * @return abstainVotes Abstain votes
     * @return quorumReached Whether quorum has been reached
     */
    function getProposalDetails(uint256 proposalId)
        public
        view
        returns (
            ProposalState status,
            uint256 forVotes,
            uint256 againstVotes,
            uint256 abstainVotes,
            bool quorumReached
        )
    {
        status = state(proposalId);
        (forVotes, againstVotes, abstainVotes) = proposalVotes(proposalId);
        
        uint256 totalVotes = forVotes + againstVotes + abstainVotes;
        uint256 quorumThreshold = quorumNumerator() * votingToken().getPastTotalSupply(proposalSnapshot(proposalId)) / 100;
        quorumReached = totalVotes >= quorumThreshold;
    }
    
    function updateQuorumNumerator(uint256 newQuorumNumerator) external override onlyOwner {
        super.updateQuorumNumerator(newQuorumNumerator);
    }
    
    function hasVoted(uint256 proposalId, address account) public view override(Governor, GovernorCountingSimple) returns (bool) {
        return super.hasVoted(proposalId, account);
    }
    
    function _countVote(uint256 proposalId, address account, uint8 support, uint256 weight) internal override(Governor, GovernorCountingSimple) {
        super._countVote(proposalId, account, support, weight);
    }
    
    function owner() public view override(Ownable) returns (address) {
        return super.owner();
    }
    
    // The following functions are overrides required by Solidity
    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }
    
    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }
    
    function quorum(uint256 blockNumber)
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }
    
    function proposalThreshold()
        public
        view
        override(GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }
    
    function state(uint256 proposalId)
        public
        view
        override(Governor)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }
    
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    )
        public
        override(Governor)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
