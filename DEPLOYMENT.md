# Vercel Deployment Guide for Private Pay DAO

This guide provides step-by-step instructions for deploying the Private Pay DAO application to Vercel.

## Prerequisites

- Vercel account (free tier available)
- GitHub account with the private-pay-dao repository
- Environment variables ready

## Step 1: Connect GitHub Repository to Vercel

1. **Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project" on the dashboard
   - Select "Import Git Repository"
   - Find and select `dylan96t/private-pay-dao`
   - Click "Import"

3. **Configure Project Settings**
   - **Project Name**: `private-pay-dao` (or your preferred name)
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Step 2: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

### Required Environment Variables

```env
# Blockchain Configuration
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Wallet Connect Configuration
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID

# Infura Configuration (Optional)
VITE_INFURA_API_KEY=YOUR_INFURA_API_KEY
VITE_RPC_URL=https://1rpc.io/sepolia

# Contract Configuration (Update after deployment)
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
```

### How to Add Environment Variables in Vercel

1. Go to your project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable:
   - **Name**: The variable name (e.g., `VITE_CHAIN_ID`)
   - **Value**: The variable value (e.g., `11155111`)
   - **Environment**: Select "Production", "Preview", and "Development"
5. Click "Save" after adding each variable

## Step 3: Deploy Smart Contract (Optional)

Before deploying the frontend, you may want to deploy the smart contract:

1. **Install Hardhat Dependencies**
   ```bash
   npm install @nomicfoundation/hardhat-toolbox hardhat dotenv
   ```

2. **Create Environment File**
   ```bash
   cp env.example .env
   ```
   
   Add your private key and other required variables to `.env`:
   ```env
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   PRIVATE_KEY=your_private_key_here
   ```

3. **Deploy Contract**
   ```bash
   npm run compile
   npm run deploy
   ```

4. **Update Contract Address**
   - Copy the deployed contract address from the deployment output
   - Update `VITE_CONTRACT_ADDRESS` in Vercel environment variables

## Step 4: Deploy to Vercel

1. **Trigger Deployment**
   - Go to your Vercel project dashboard
   - Click "Deploy" or push changes to the main branch
   - Vercel will automatically build and deploy

2. **Monitor Build Process**
   - Watch the build logs for any errors
   - Ensure all dependencies install correctly
   - Check that the build completes successfully

## Step 5: Configure Custom Domain (Optional)

1. **Add Domain**
   - Go to project settings
   - Click "Domains" in the sidebar
   - Add your custom domain
   - Follow DNS configuration instructions

2. **SSL Certificate**
   - Vercel automatically provides SSL certificates
   - No additional configuration needed

## Step 6: Verify Deployment

1. **Test Application**
   - Visit your deployed URL
   - Test wallet connection functionality
   - Verify all features work correctly

2. **Check Console**
   - Open browser developer tools
   - Check for any JavaScript errors
   - Verify environment variables are loaded

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility
   - Review build logs for specific errors

2. **Environment Variables Not Loading**
   - Ensure variables start with `VITE_`
   - Check that variables are added to all environments
   - Redeploy after adding new variables

3. **Wallet Connection Issues**
   - Verify WalletConnect Project ID is correct
   - Check that RPC URLs are accessible
   - Ensure contract address is set correctly

4. **Contract Interaction Issues**
   - Verify contract is deployed to Sepolia testnet
   - Check that contract address is correct
   - Ensure user has testnet ETH for transactions

### Performance Optimization

1. **Enable Analytics**
   - Go to project settings
   - Enable Vercel Analytics
   - Monitor performance metrics

2. **Configure Caching**
   - Vercel automatically optimizes static assets
   - No additional configuration needed for most cases

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive keys to Git
   - Use Vercel's environment variable system
   - Regularly rotate API keys

2. **Smart Contract Security**
   - Audit contracts before mainnet deployment
   - Use testnets for development
   - Implement proper access controls

## Monitoring and Maintenance

1. **Set Up Monitoring**
   - Enable Vercel Analytics
   - Set up error tracking (Sentry, etc.)
   - Monitor contract events

2. **Regular Updates**
   - Keep dependencies updated
   - Monitor for security vulnerabilities
   - Update contract addresses as needed

## Support

For issues with:
- **Vercel Deployment**: Check Vercel documentation
- **Smart Contract**: Review Hardhat documentation
- **Wallet Integration**: Check RainbowKit documentation
- **FHE Integration**: Review Zama documentation

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Hardhat Documentation](https://hardhat.org/docs)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs)
- [Zama FHE Documentation](https://docs.zama.ai/fhevm)
