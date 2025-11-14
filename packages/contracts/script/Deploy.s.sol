// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/BGT.sol";
import "../src/BGTDAO.sol";
import "../src/BGTTreasury.sol";
import "../src/BietIdentity.sol";
import "../src/ProductiveUnit.sol";
import "../src/RevenueShare.sol";
import "../src/TimelockController.sol";

/**
 * @title Deploy Script
 * @dev Script para desplegar todos los contratos de Red Biet en Base
 * @author Biet Network Team
 */
contract DeployScript is Script {
    // Configuration
    uint256 private deployerPrivateKey;
    address private deployer;
    
    // Contract addresses
    BGT public bgt;
    BGTDAO public dao;
    TimelockController public timelock;
    BGTTreasury public treasury;
    BietIdentity public identity;
    ProductiveUnit public productiveUnit;
    RevenueShare public revenueShare;
    
    // Multi-sig addresses for production
    address[] public proposers;
    address[] public executors;
    address[] public treasuryPayees;
    uint256[] public treasuryShares;
    
    function setUp() public {
        deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        deployer = vm.addr(deployerPrivateKey);
        
        // Setup proposers and executors for Timelock
        proposers = [deployer];
        executors = [deployer];
        
        // Setup treasury payees and shares
        treasuryPayees = [deployer];
        treasuryShares = [100];
    }
    
    function run() public virtual {
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy Timelock Controller
        uint256 minDelay = 2 days;
        timelock = new TimelockController(
            minDelay,
            proposers,
            executors,
            deployer
        );
        
        // 2. Deploy BGT Token
        bgt = new BGT(
            deployer,           // initialOwner
            address(timelock),  // treasury
            deployer           // communityFund
        );
        
        // 3. Deploy DAO
        dao = new BGTDAO(
            IVotes(address(bgt)),
            timelock,
            deployer
        );
        
        // 4. Deploy Treasury
        treasury = new BGTTreasury(address(bgt), address(dao), treasuryPayees, treasuryShares, deployer);
        
        // 5. Deploy Identity Contract
        identity = new BietIdentity(deployer, deployer, 0.001 ether);
        
        // 6. Deploy Productive Unit
        productiveUnit = new ProductiveUnit(deployer, address(bgt), address(identity), address(treasury), 250, treasuryPayees, treasuryShares);
        
        // 7. Deploy Revenue Share
        revenueShare = new RevenueShare(
            treasuryPayees,
            treasuryShares,
            address(treasury),
            250 // 2.5% platform fee
        );
        
        // 8. Setup roles and permissions
        _setupRoles();
        
        // 9. Transfer ownerships to DAO/Timelock
        _transferOwnerships();
        
        vm.stopBroadcast();
        
        // Log deployment addresses
        _logDeployments();
    }
    
    function _setupRoles() internal {
        // Setup Timelock roles
        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        bytes32 adminRole = timelock.DEFAULT_ADMIN_ROLE();
        
        timelock.grantRole(proposerRole, address(dao));
        timelock.grantRole(executorRole, address(dao));
        
        // Setup DAO roles (timelock should be admin)
        // This is done in the constructor
        
        // Setup Treasury roles
        treasury.grantRole(treasury.ADMIN_ROLE(), address(timelock));
        treasury.grantRole(treasury.OPERATOR_ROLE(), address(timelock));
        
        // Setup Identity roles
        identity.grantRole(identity.ADMIN_ROLE(), address(timelock));
        identity.grantRole(identity.ISSUER_ROLE(), address(timelock));
        
        // Setup Productive Unit roles
        productiveUnit.grantRole(productiveUnit.ADMIN_ROLE(), address(timelock));
        productiveUnit.grantRole(productiveUnit.CREATOR_ROLE(), address(timelock));
        
        // Setup Revenue Share roles
        revenueShare.grantRole(revenueShare.ADMIN_ROLE(), address(timelock));
        revenueShare.grantRole(revenueShare.OPERATOR_ROLE(), address(timelock));
    }
    
    function _transferOwnerships() internal {
        // Transfer BGT ownership to timelock
        bgt.transferOwnership(address(timelock));
        
        // Transfer DAO ownership to timelock
        dao.transferOwnership(address(timelock));
        
        // Transfer Treasury ownership to timelock
        treasury.transferOwnership(address(timelock));
        
        // Transfer Identity ownership to timelock
        identity.transferOwnership(address(timelock));
        
        // Transfer Productive Unit ownership to timelock
        productiveUnit.transferOwnership(address(timelock));
        
        // Transfer Revenue Share ownership to timelock
        revenueShare.transferOwnership(address(timelock));
        
        // Renounce deployer's admin role in timelock (after setup is complete)
        // timelock.renounceRole(timelock.DEFAULT_ADMIN_ROLE(), deployer);
    }
    
    function _logDeployments() internal view {
        console.log("=== Red Biet Deployment Complete ===");
        console.log("Network: Base");
        console.log("Deployer:", deployer);
        console.log("");
        console.log("Contract Addresses:");
        console.log("BGT Token:", address(bgt));
        console.log("Timelock Controller:", address(timelock));
        console.log("BGT DAO:", address(dao));
        console.log("Treasury:", address(treasury));
        console.log("Identity:", address(identity));
        console.log("Productive Unit:", address(productiveUnit));
        console.log("Revenue Share:", address(revenueShare));
        console.log("");
        console.log("=== Verification Commands ===");
        console.log("BGT:", _getVerificationCommand(address(bgt)));
        console.log("DAO:", _getVerificationCommand(address(dao)));
        console.log("Treasury:", _getVerificationCommand(address(treasury)));
        console.log("Identity:", _getVerificationCommand(address(identity)));
        console.log("ProductiveUnit:", _getVerificationCommand(address(productiveUnit)));
        console.log("RevenueShare:", _getVerificationCommand(address(revenueShare)));
        console.log("Timelock:", _getVerificationCommand(address(timelock)));
    }
    
    function _getVerificationCommand(address contractAddress) internal view returns (string memory) {
        return string(abi.encodePacked(
            "forge verify-contract ",
            vm.toString(contractAddress),
            " src/BGT.sol:BGT --chain-id 8453 --etherscan-api-key $ETHERSCAN_API_KEY"
        ));
    }
}

/**
 * @title DeployTestnet Script
 * @dev Script para desplegar en Base Sepolia testnet
 */
contract DeployTestnetScript is DeployScript {
    function run() public override {
        // Override with testnet-specific configuration if needed
        super.run();
    }
}

/**
 * @title Upgrade Script
 * @dev Script para actualizar contratos usando proxy pattern
 */
contract UpgradeScript is Script {
    uint256 private deployerPrivateKey;
    address private deployer;
    
    function setUp() public {
        deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        deployer = vm.addr(deployerPrivateKey);
    }
    
    function run() public {
        vm.startBroadcast(deployerPrivateKey);
        
        // Implementation upgrade logic would go here
        // This is a placeholder for future proxy upgrades
        
        vm.stopBroadcast();
        
        console.log("=== Upgrade Complete ===");
    }
}
