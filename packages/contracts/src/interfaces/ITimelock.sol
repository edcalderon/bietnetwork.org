// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ITimelock {
    function proposerRole() external view returns (bytes32);
    function executorRole() external view returns (bytes32);
    function grantRole(bytes32 role, address account) external;
    function schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay) external;
    function execute(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt) external;
}
