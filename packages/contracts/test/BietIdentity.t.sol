// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/BietIdentity.sol";

contract BietIdentityTest is Test {
    BietIdentity identity;

    address admin = address(0xA11CE);
    address verifier;
    address user = address(0xCAFE);

    function setUp() public {
        // derive verifier address from a known private key so we can sign in tests
        uint256 verifierPk = 0xBEEF;
        verifier = vm.addr(verifierPk);

        uint256 fee = 0.01 ether;
        identity = new BietIdentity(admin, verifier, fee);

        vm.deal(user, 1 ether);
        vm.deal(verifier, 1 ether);
    }

    function testMintIdentityWithVerifierSignature() public {
        // 1) start nonce is zero
        uint256 nonce = identity.mintNonces(user);
        assertEq(nonce, 0);

        // 2) build identityHash exactly like contract
        bytes32 identityHash = keccak256(
            abi.encodePacked(
                user,
                "Deployer Test",
                "did:biet:deployer-test",
                "US",
                "verified",
                nonce
            )
        );

        // 3) build messageHash with prefix (like contract)
        bytes32 messageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", identityHash)
        );

        // 4) sign with verifier key using Foundry's cheatcodes
        uint256 verifierPk = 0xBEEF; // same key used in setUp
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(verifierPk, messageHash);
        bytes memory sig = abi.encodePacked(r, s, v);

        // 5) user calls mintIdentity with that signature and fee
        vm.prank(user);
        identity.mintIdentity{value: identity.verificationFee()}(
            user,
            "Deployer Test",
            "did:biet:deployer-test",
            "US",
            "verified",
            sig
        );

        // 6) assert that identity is stored correctly
        BietIdentity.Identity memory idStruct = identity.getIdentityByAddress(user);

        assertEq(idStruct.name, "Deployer Test");
        assertEq(idStruct.did, "did:biet:deployer-test");
        assertEq(idStruct.country, "US");
        assertEq(idStruct.verificationLevel, "verified");
        assertTrue(idStruct.isActive);
        assertEq(idStruct.identityHash, identityHash);

        // 7) nonce incremented
        assertEq(identity.mintNonces(user), 1);
    }
}
