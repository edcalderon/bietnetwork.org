// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Math {
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a <= b ? a : b;
    }

    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        return (a & b) + (a ^ b) / 2;
    }

    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        return (a + b - 1) / b;
    }

    function mulDiv(
        uint256 x,
        uint256 y,
        uint256 denominator
    ) internal pure returns (uint256 result) {
        unchecked {
            uint256 prod = x * y;
            if (prod == 0) {
                return 0;
            }
            result = prod / denominator;
        }
    }

    function sqrt(uint256 a) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 result = 1;
        uint256 x = a;
        if (x >= 2 ** 128) {
            x >>= 128;
            result <<= 64;
        }
        if (x >= 2 ** 64) {
            x >>= 64;
            result <<= 32;
        }
        if (x >= 2 ** 32) {
            x >>= 32;
            result <<= 16;
        }
        if (x >= 2 ** 16) {
            x >>= 16;
            result <<= 8;
        }
        if (x >= 2 ** 8) {
            x >>= 8;
            result <<= 4;
        }
        if (x >= 2 ** 4) {
            x >>= 4;
            result <<= 2;
        }
        if (x >= 2 ** 2) {
            x >>= 2;
            result <<= 1;
        }

        result = (result + a / result) >> 1;
        result = (result + a / result) >> 1;
        result = (result + a / result) >> 1;
        result = (result + a / result) >> 1;

        return result;
    }
}
