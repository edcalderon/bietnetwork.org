// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/ITimelock.sol";
import "./access/AccessControl.sol";

contract TimelockController is ITimelock, AccessControl {
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant CANCELLER_ROLE = keccak256("CANCELLER_ROLE");
    
    uint256 public minDelay;
    
    constructor(
        uint256 _minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) {
        minDelay = _minDelay;
        
        _grantRole(AccessControl.DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PROPOSER_ROLE, admin);
        _grantRole(EXECUTOR_ROLE, admin);
        _grantRole(CANCELLER_ROLE, admin);
        
        for (uint256 i = 0; i < proposers.length; i++) {
            _grantRole(PROPOSER_ROLE, proposers[i]);
        }
        
        for (uint256 i = 0; i < executors.length; i++) {
            _grantRole(EXECUTOR_ROLE, executors[i]);
        }
    }
    
    function proposerRole() external view override returns (bytes32) {
        return PROPOSER_ROLE;
    }
    
    function executorRole() external view override returns (bytes32) {
        return EXECUTOR_ROLE;
    }
    
    function grantRole(bytes32 role, address account) public override(AccessControl, ITimelock) {
        super.grantRole(role, account);
    }
    
    function schedule(address /*target*/, uint256 /*value*/, bytes calldata /*data*/, bytes32 /*predecessor*/, bytes32 /*salt*/, uint256 delay) external override {
        // Simplified implementation
        require(delay >= minDelay, "Delay too short");
        require(hasRole(PROPOSER_ROLE, msg.sender), "Not proposer");
    }
    
    function execute(address target, uint256 value, bytes calldata data, bytes32 /*predecessor*/, bytes32 /*salt*/) external override {
        require(hasRole(EXECUTOR_ROLE, msg.sender), "Not executor");
        (bool success, ) = target.call{value: value}(data);
        require(success, "Execution failed");
    }
}
