# Biet Network - Testnet Deployment Guide

## 🚀 Quick Start for Base Sepolia Testnet

### 1. Setup Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your values
nano .env
```

### 2. Required Environment Variables

Add these values to your `.env` file:

```bash
# Your deployer wallet private key (from MetaMask)
PRIVATE_KEY=0x...

# Base Sepolia RPC URL
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# BaseScan API key for verification (get from https://basescan.org/)
BASESCAN_API_KEY=your_api_key_here
```

### 3. Get Test ETH

1. **Get Base Sepolia ETH from faucet:**
   - Visit: https://sepoliafaucet.com/
   - Or: https://www.basefaucet.com/
   - Enter your wallet address to receive test ETH

2. **Check your balance:**
   ```bash
   cast balance <your_wallet_address> --rpc-url base-sepolia
   ```

### 4. Deploy Contracts

```bash
# Navigate to contracts directory
cd packages/contracts

# Deploy to Base Sepolia testnet
forge script script/Deploy.s.sol --rpc-url base-sepolia --broadcast

# Deploy with verification (recommended)
forge script script/Deploy.s.sol --rpc-url base-sepolia --broadcast --verify
```

### 5. Verify Deployment

After deployment, you'll see output like:
```
Deployed BGT at: 0x1234...
Deployed BGTDAO at: 0x5678...
Deployed BGTTreasury at: 0x9abc...
```

### 6. Update .env with Deployed Addresses

Add the deployed addresses to your `.env`:
```bash
BGT_TOKEN_ADDRESS=0x...
BGT_DAO_ADDRESS=0x...
BGT_TREASURY_ADDRESS=0x...
BIET_IDENTITY_ADDRESS=0x...
PRODUCTIVE_UNIT_ADDRESS=0x...
REVENUE_SHARE_ADDRESS=0x...
TIMELOCK_CONTROLLER_ADDRESS=0x...
```

## 🔧 Useful Commands

### Check Contract Deployment
```bash
# Check if contract exists
cast code <contract_address> --rpc-url base-sepolia

# Get contract owner
cast call <contract_address> "owner()" --rpc-url base-sepolia
```

### Interact with Deployed Contracts
```bash
# Check token balance
cast call <bgt_address> "balanceOf(address)" <your_address> --rpc-url base-sepolia

# Check DAO settings
cast call <dao_address> "votingPeriod()" --rpc-url base-sepolia
cast call <dao_address> "quorumNumerator()" --rpc-url base-sepolia
```

### Verify on BaseScan
- Visit: https://sepolia.basescan.org/
- Search for your contract addresses
- Check the "Contract" tab to see verified source code

## 📋 Deployment Checklist

- [ ] Get test ETH from faucet
- [ ] Set up PRIVATE_KEY in .env
- [ ] Set up BASE_SEPOLIA_RPC_URL in .env
- [ ] Get BASESCAN_API_KEY for verification
- [ ] Run deployment script
- [ ] Verify contracts on BaseScan
- [ ] Test basic functionality
- [ ] Save deployed addresses

## 🛠 Troubleshooting

### "Insufficient funds" error
- Make sure you have enough test ETH in your wallet
- Check balance with: `cast balance <address> --rpc-url base-sepolia`

### "Private key invalid" error
- Ensure your private key starts with `0x`
- Double-check you're using the correct private key from MetaMask

### "RPC timeout" error
- Try a different RPC URL (Alchemy or Infura)
- Check your internet connection

### "Verification failed" error
- Ensure BASESCAN_API_KEY is correct
- Wait a few minutes after deployment before verifying
- Try without `--verify` first, then verify separately

## 📚 Next Steps

After successful testnet deployment:

1. **Test the contracts** - Use the deployed addresses to test functionality
2. **Update frontend** - Configure your dApp to use testnet addresses
3. **Prepare for mainnet** - Review security practices before mainnet deployment

## 🔒 Security Reminders

- **NEVER** commit your `.env` file to git
- **NEVER** share your private keys
- **ONLY** use testnet private keys for testnet deployments
- **CONSIDER** using a hardware wallet for mainnet deployments

## 🆘 Need Help?

- Check the [Foundry documentation](https://book.getfoundry.sh/)
- Review [Base documentation](https://docs.base.org/)
- Join the Biet Network community for support
