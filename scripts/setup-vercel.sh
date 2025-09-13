#!/bin/bash

# Private Pay DAO - Vercel Setup Script
# This script helps set up the project for Vercel deployment

echo "🚀 Setting up Private Pay DAO for Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

# Create .env.local file for local development
echo "📝 Creating environment file..."
cat > .env.local << EOF
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
EOF

echo "✅ Environment file created: .env.local"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update environment variables in Vercel dashboard"
echo "2. Deploy smart contract (optional): npm run deploy"
echo "3. Update VITE_CONTRACT_ADDRESS in Vercel"
echo "4. Test the deployed application"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"
