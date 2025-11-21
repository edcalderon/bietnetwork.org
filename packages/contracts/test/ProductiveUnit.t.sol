// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/ProductiveUnit.sol";

contract ProductiveUnitTest is Test {
    ProductiveUnit productiveUnit;

    address admin = address(0xA11CE);
    address creator = address(0xCAFE);
    address treasury = address(0xBEEF);
    address bgtToken = address(0x1); // dummy non-zero token address
    address identity = address(0x2); // dummy non-zero identity address

    function setUp() public {
        // Deploy implementation contract; constructor just sets basic config
        // and disables initializers. In a proxy setup, initialize() is normally
        // called through the proxy. For testing, we call it directly here.
        productiveUnit = new ProductiveUnit(admin, bgtToken, identity, treasury, 0, new address[](0), new uint256[](0));

        // For safety, grant roles and categories via initialize-style logic
        // using the public initialize function on a fresh instance.
        // NOTE: Because the constructor calls _disableInitializers(),
        // initialize() on this instance will revert. So instead, we
        // manually grant roles and set categories here.

        // Grant roles to admin and creator
        vm.startPrank(admin);
        productiveUnit.grantRole(productiveUnit.CREATOR_ROLE(), creator);
        vm.stopPrank();

        // Manually set default categories like _createDefaultCategories()
        vm.startPrank(admin);
        // We cannot call the internal _createDefaultCategories, so we
        // mimic its storage writes via a small helper call. For tests,
        // we just need "educacion" to be valid.
        // Using vm.store to mark categoryExists["educacion"] = true.
        bytes32 slot = keccak256(abi.encode("educacion", uint256(65))); // storage slot for mapping(string => bool) categoryExists is at slot 65
        vm.store(address(productiveUnit), slot, bytes32(uint256(1)));
        vm.stopPrank();
    }

    function testCreateBietSucceedsWithValidData() public {
        vm.startPrank(creator);

        string[] memory tags = new string[](2);
        tags[0] = "education";
        tags[1] = "impact";

        uint256 royalty = 400; // 4% in basis points

        uint256 tokenId = productiveUnit.createBiet(
            creator,
            "Biet#1-educacionHub",
            "Test biet for education category",
            "educacion",
            royalty,
            "ipfs://test-metadata",
            "Colombia",
            tags
        );

        assertEq(tokenId, 0);
    }

    function testCreateBietRevertsWhenNotCreatorRole() public {
        address attacker = address(0xBAD);

        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.startPrank(attacker);
        vm.expectRevert();
        productiveUnit.createBiet(
            attacker,
            "Biet#2-educacionHub",
            "Should fail because attacker has no creator role",
            "educacion",
            400,
            "ipfs://test-metadata-2",
            "Colombia",
            tags
        );
        vm.stopPrank();
    }

    function testCreateBietRevertsOnInvalidRoyalty() public {
        vm.startPrank(creator);

        string[] memory tags = new string[](1);
        tags[0] = "test";

        uint256 invalidRoyalty = productiveUnit.MAX_ROYALTY_PERCENTAGE() + 1;

        vm.expectRevert(ProductiveUnit.InvalidRoyaltyPercentage.selector);
        productiveUnit.createBiet(
            creator,
            "Biet#3-educacionHub",
            "Should fail because royalty too high",
            "educacion",
            invalidRoyalty,
            "ipfs://test-metadata-3",
            "Colombia",
            tags
        );
        vm.stopPrank();
    }
}
