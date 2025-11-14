// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../src/BGT.sol";
import "../src/BGTDAO.sol";
import "../src/TimelockController.sol";

/**
 * @title BGT DAO Test
 * @dev Tests para el contrato BGTDAO
 */
contract BGTDAOTest {
    BGT public bgt;
    BGTDAO public dao;
    TimelockController public timelock;
    address public owner;
    address public proposer;
    address public executor;
    address public voter1;
    address public voter2;
    address public voter3;
    
    uint256 public constant VOTING_POWER = 1_000_000 * 10**18; // 1M BGT
    uint256 public constant PROPOSAL_THRESHOLD = 1_000_000 * 10**18; // 1M BGT
    
    function setUp() public {
        owner = address(this);
        proposer = address(0x1);
        executor = address(0x2);
        voter1 = address(0x3);
        voter2 = address(0x4);
        voter3 = address(0x5);
        
        // Deploy BGT token
        bgt = new BGT(owner, owner, owner);
        
        // Deploy Timelock
        address[] memory proposers = new address[](1);
        proposers[0] = proposer;
        address[] memory executors = new address[](1);
        executors[0] = proposer;
        
        timelock = new TimelockController(
            2 days,
            proposers,
            executors,
            owner
        );
        
        // Deploy DAO
        dao = new BGTDAO(
            IVotes(address(bgt)),
            timelock,
            owner
        );
        
        // Mint tokens for voting
        bgt.mint(voter1, VOTING_POWER);
        bgt.mint(voter2, VOTING_POWER);
        bgt.mint(voter3, VOTING_POWER);
        
        // Delegate voting power (simplified - delegate from owner)
        bgt.delegate(voter1);
        bgt.delegate(voter2);
        bgt.delegate(voter3);
    }
    
    function testDeployment() public {
        assert(dao.name() == "Biet Network DAO");
        assert(dao.votingDelay() == 1 days);
        assert(dao.votingPeriod() == 7 days);
        assert(dao.proposalThreshold() == PROPOSAL_THRESHOLD);
        assert(dao.quorum(0) == 0); // No supply at block 0
    }
    
    function testPropose() public {
        address[] memory targets = new address[](1);
        targets[0] = address(this);
        
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("receive()");
        
        string memory description = "Test proposal";
        
        vm.prank(proposer);
        uint256 proposalId = dao.propose(targets, values, calldatas, description);
        
        assertTrue(proposalId > 0);
        assertEq(dao.state(proposalId), BGTDAO.ProposalState.Pending);
    }
    
    function testProposeWithMetadata() public {
        address[] memory targets = new address[](1);
        targets[0] = address(this);
        
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("receive()");
        
        string memory description = "Test proposal with metadata";
        string memory metadata = "ipfs://QmTest";
        
        vm.prank(proposer);
        uint256 proposalId = dao.proposeWithMetadata(targets, values, calldatas, description, metadata);
        
        assertTrue(proposalId > 0);
        assertEq(dao.state(proposalId), BGTDAO.ProposalState.Pending);
    }
    
    function testProposeInsufficientThreshold() public {
        address[] memory targets = new address[](1);
        targets[0] = address(this);
        
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("receive()");
        
        string memory description = "Test proposal";
        
        // User with no voting power tries to propose
        vm.prank(makeAddr("user"));
        vm.expectRevert();
        dao.propose(targets, values, calldatas, description);
    }
    
    function testVote() public {
        uint256 proposalId = _createTestProposal();
        
        // Fast forward past voting delay
        vm.roll(block.number + dao.votingDelay() + 1);
        
        // Vote in favor
        vm.prank(voter1);
        dao.castVote(proposalId, 1); // 1 = For
        
        (uint256 forVotes, uint256 againstVotes, uint256 abstainVotes) = dao.proposalVotes(proposalId);
        assertEq(forVotes, VOTING_POWER);
        assertEq(againstVotes, 0);
        assertEq(abstainVotes, 0);
    }
    
    function testVoteAgainst() public {
        uint256 proposalId = _createTestProposal();
        
        // Fast forward past voting delay
        vm.roll(block.number + dao.votingDelay() + 1);
        
        // Vote against
        vm.prank(voter1);
        dao.castVote(proposalId, 0); // 0 = Against
        
        (uint256 forVotes, uint256 againstVotes, uint256 abstainVotes) = dao.proposalVotes(proposalId);
        assertEq(forVotes, 0);
        assertEq(againstVotes, VOTING_POWER);
        assertEq(abstainVotes, 0);
    }
    
    function testVoteAbstain() public {
        uint256 proposalId = _createTestProposal();
        
        // Fast forward past voting delay
        vm.roll(block.number + dao.votingDelay() + 1);
        
        // Abstain
        vm.prank(voter1);
        dao.castVote(proposalId, 2); // 2 = Abstain
        
        (uint256 forVotes, uint256 againstVotes, uint256 abstainVotes) = dao.proposalVotes(proposalId);
        assertEq(forVotes, 0);
        assertEq(againstVotes, 0);
        assertEq(abstainVotes, VOTING_POWER);
    }
    
    function testCanVote() public {
        uint256 proposalId = _createTestProposal();
        
        // Before voting starts
        assertFalse(dao.canVote(voter1, proposalId));
        
        // Fast forward past voting delay
        vm.roll(block.number + dao.votingDelay() + 1);
        
        // During voting period
        assertTrue(dao.canVote(voter1, proposalId));
        
        // After voting period
        vm.roll(block.number + dao.votingPeriod() + 1);
        assertFalse(dao.canVote(voter1, proposalId));
    }
    
    function testGetProposalDetails() public {
        uint256 proposalId = _createTestProposal();
        
        // Fast forward past voting delay
        vm.roll(block.number + dao.votingDelay() + 1);
        
        // Add some votes
        vm.prank(voter1);
        dao.castVote(proposalId, 1);
        vm.prank(voter2);
        dao.castVote(proposalId, 0);
        vm.prank(voter3);
        dao.castVote(proposalId, 2);
        
        (
            BGTDAO.ProposalState status,
            uint256 forVotes,
            uint256 againstVotes,
            uint256 abstainVotes,
            bool quorumReached
        ) = dao.getProposalDetails(proposalId);
        
        assertEq(status, BGTDAO.ProposalState.Active);
        assertEq(forVotes, VOTING_POWER);
        assertEq(againstVotes, VOTING_POWER);
        assertEq(abstainVotes, VOTING_POWER);
        
        uint256 totalVotes = forVotes + againstVotes + abstainVotes;
        uint256 quorum = dao.quorum(dao.proposalSnapshot(proposalId));
        assertEq(quorumReached, totalVotes >= quorum);
    }
    
    function testQuorumCalculation() public {
        // Fast forward to have some token supply
        vm.roll(block.number + 1);
        
        uint256 currentSupply = bgt.getPastTotalSupply(block.number - 1);
        uint256 expectedQuorum = (currentSupply * 4) / 100; // 4%
        
        assertEq(dao.quorum(block.number - 1), expectedQuorum);
    }
    
    function _createTestProposal() internal returns (uint256) {
        address[] memory targets = new address[](1);
        targets[0] = address(this);
        
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("receive()");
        
        string memory description = "Test proposal";
        
        vm.prank(proposer);
        return dao.propose(targets, values, calldatas, description);
    }
    
    receive() external payable {}
}
