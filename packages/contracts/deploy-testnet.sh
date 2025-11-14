#!/bin/bash

# ==============================================================================
# Biet Network - Base Sepolia Testnet Deployment Script
# ==============================================================================

set -e

echo "🚀 Biet Network - Base Sepolia Testnet Deployment"
echo "=================================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and fill in your values:"
    echo "cp .env.example .env"
    exit 1
fi

# Load environment variables
source .env

# Check required variables
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not found in .env file"
    exit 1
fi

if [ -z "$BASE_SEPOLIA_RPC_URL" ]; then
    echo "❌ BASE_SEPOLIA_RPC_URL not found in .env file"
    exit 1
fi

echo "📋 Configuration Check:"
echo "✅ .env file found"
echo "✅ PRIVATE_KEY configured"
echo "✅ BASE_SEPOLIA_RPC_URL configured"

# Check wallet balance
echo ""
echo "💰 Checking wallet balance..."
WALLET_ADDRESS=$(cast wallet address --private-key $PRIVATE_KEY)
echo "📍 Wallet address: $WALLET_ADDRESS"

BALANCE=$(cast balance $WALLET_ADDRESS --rpc-url $BASE_SEPOLIA_RPC_URL)
echo "💵 Balance: $BALANCE ETH"

# Convert balance to wei for check
BALANCE_WEI=$(cast to-wei $BALANCE)
MIN_BALANCE=$(cast to-wei 0.01)

if [ "$BALANCE_WEI" -lt "$MIN_BALANCE" ]; then
    echo "⚠️  Warning: Low balance! Get test ETH from https://sepoliafaucet.com/"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🔨 Starting deployment..."
echo "Network: Base Sepolia"
echo "RPC: $BASE_SEPOLIA_RPC_URL"

# Run deployment
if [ -n "$BASESCAN_API_KEY" ]; then
    echo "🔍 Verifying contracts on BaseScan..."
    forge script script/Deploy.s.sol \
        --rpc-url $BASE_SEPOLIA_RPC_URL \
        --broadcast \
        --verify \
        --verifier-url https://api-sepolia.basescan.org/api \
        --etherscan-api-key $BASESCAN_API_KEY
else
    echo "⚠️  Skipping verification (no BASESCAN_API_KEY found)"
    echo "🔨 Deploying contracts..."
    forge script script/Deploy.s.sol \
        --rpc-url $BASE_SEPOLIA_RPC_URL \
        --broadcast
fi

echo ""
echo "✅ Deployment completed!"
echo ""
echo "📊 Next steps:"
echo "1. Check the deployed addresses above"
echo "2. Update your .env file with the deployed addresses"
echo "3. Verify on BaseScan: https://sepolia.basescan.org/"
echo "4. Test the contracts using the deployed addresses"
echo ""
echo "📚 For more help, see DEPLOYMENT_GUIDE.md"
