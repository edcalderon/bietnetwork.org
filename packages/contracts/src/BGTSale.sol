// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./token/ERC20/IERC20.sol";
import "./token/ERC20/utils/SafeERC20.sol";
import "./utils/ReentrancyGuard.sol";
import "./access/Ownable.sol";
import "./ProductiveUnit.sol";

/**
 * @title BGTSale
 * @dev Sells pre-minted BGT tokens for ETH with a price that increases
 *      as more Biets (productive units) are created.
 *
 * Price model (simple linear example):
 *   pricePerBGT = basePrice * (1 + totalBiets)
 * where basePrice is expressed in wei per 1 BGT (18 decimals).
 *
 * BGT must be pre-minted to this contract. All ETH raised is forwarded
 * to the BGTTreasury.
 */
contract BGTSale is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable bgt;
    ProductiveUnit public immutable productiveUnit;
    address payable public immutable treasury;

    // Base price in wei per 1 BGT (1e18 units). For example, 0.0001 ether.
    uint256 public basePrice;

    event BgtPurchased(address indexed buyer, uint256 ethIn, uint256 bgtOut, uint256 pricePerBgt);
    event BasePriceUpdated(uint256 oldPrice, uint256 newPrice);

    error InvalidAmount();
    error InsufficientLiquidity();
    error TransferFailed();

    constructor(
        address _bgt,
        address _productiveUnit,
        address payable _treasury,
        uint256 _basePrice
    ) {
        require(_bgt != address(0) && _productiveUnit != address(0) && _treasury != address(0), "BGTSale: zero address");
        require(_basePrice > 0, "BGTSale: basePrice = 0");

        bgt = IERC20(_bgt);
        productiveUnit = ProductiveUnit(_productiveUnit);
        treasury = _treasury;
        basePrice = _basePrice;
    }

    /**
     * @dev Returns the current price per 1 BGT (in wei) based on total Biets.
     */
    function currentPrice() public view returns (uint256) {
        uint256 n = productiveUnit.totalBiets();
        // pricePerBGT = basePrice * (1 + n)
        return basePrice * (1 + n);
    }

    /**
     * @dev Quote how many BGT would be received for a given ETH amount at
     *      the current price. Result is in 18-decimal BGT units.
     */
    function quoteBgt(uint256 ethAmount) external view returns (uint256) {
        if (ethAmount == 0) return 0;
        uint256 pricePerBgt = currentPrice();
        // bgtAmount = ethAmount * 1e18 / pricePerBgt
        return (ethAmount * 1e18) / pricePerBgt;
    }

    /**
     * @dev Quote how much ETH is required to buy a given amount of BGT at
     *      the current price.
     */
    function quoteEth(uint256 bgtAmount) external view returns (uint256) {
        if (bgtAmount == 0) return 0;
        uint256 pricePerBgt = currentPrice();
        // ethAmount = bgtAmount * pricePerBgt / 1e18
        return (bgtAmount * pricePerBgt) / 1e18;
    }

    /**
     * @dev Buy BGT with ETH at the current price.
     * @param minBgtOut Minimum amount of BGT the caller is willing to accept
     *                  (slippage protection).
     */
    function buy(uint256 minBgtOut) external payable nonReentrant {
        if (msg.value == 0) revert InvalidAmount();

        uint256 pricePerBgt = currentPrice();
        uint256 bgtAmount = (msg.value * 1e18) / pricePerBgt;
        if (bgtAmount == 0 || bgtAmount < minBgtOut) revert InvalidAmount();

        uint256 balance = bgt.balanceOf(address(this));
        if (balance < bgtAmount) revert InsufficientLiquidity();

        // Transfer BGT to buyer
        bgt.safeTransfer(msg.sender, bgtAmount);

        // Forward ETH to treasury
        (bool success, ) = treasury.call{value: msg.value}("");
        if (!success) revert TransferFailed();

        emit BgtPurchased(msg.sender, msg.value, bgtAmount, pricePerBgt);
    }

    /**
     * @dev Admin function to update the base price.
     */
    function updateBasePrice(uint256 newBasePrice) external onlyOwner {
        require(newBasePrice > 0, "BGTSale: basePrice = 0");
        uint256 oldPrice = basePrice;
        basePrice = newBasePrice;
        emit BasePriceUpdated(oldPrice, newBasePrice);
    }

    /**
     * @dev Rescue unsold BGT back to a recipient (e.g. treasury or owner).
     */
    function withdrawUnsoldBGT(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "BGTSale: zero to");
        bgt.safeTransfer(to, amount);
    }
}
