// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {ProductiveUnit} from "../src/ProductiveUnit.sol";

/// @title DeployProductiveUnitOnlyScript
/// @dev Deploys ONLY a new ProductiveUnit using existing BGT, Identity, and Treasury addresses from env.
contract DeployProductiveUnitOnlyScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // Read existing infra addresses from env
        address bgt = vm.envAddress("NEXT_PUBLIC_BGT_TOKEN_ADDRESS");
        address identity = vm.envAddress("NEXT_PUBLIC_BIET_IDENTITY_ADDRESS");
        address treasury = vm.envAddress("NEXT_PUBLIC_TREASURY_ADDRESS");

        // Simple payees/shares config to satisfy constructor arguments
        address[] memory payees = new address[](1);
        uint256[] memory shares = new uint256[](1);
        payees[0] = treasury;
        shares[0] = 100;

        vm.startBroadcast(deployerPrivateKey);

        ProductiveUnit productiveUnit = new ProductiveUnit(
            deployer,       // admin (gets DEFAULT_ADMIN, ADMIN, CREATOR, OPERATOR)
            bgt,            // BGT token
            identity,       // BietIdentity
            treasury,       // Treasury address
            250,            // platform fee (basis points) - keep consistent with main deploy
            payees,
            shares
        );

        vm.stopBroadcast();

        console.log("=== ProductiveUnit-only deployment ===");
        console.log("Deployer:", deployer);
        console.log("Productive Unit:", address(productiveUnit));
    }
}
