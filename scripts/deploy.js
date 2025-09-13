const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying PrivatePayDAO contract...");

  // Get the contract factory
  const PrivatePayDAO = await ethers.getContractFactory("PrivatePayDAO");

  // Deploy the contract
  // You'll need to provide a verifier address
  const verifierAddress = "0x..."; // Replace with actual verifier address
  
  const privatePayDAO = await PrivatePayDAO.deploy(verifierAddress);

  await privatePayDAO.waitForDeployment();

  const contractAddress = await privatePayDAO.getAddress();
  
  console.log("PrivatePayDAO deployed to:", contractAddress);
  console.log("Verifier address:", verifierAddress);
  
  // Save the contract address to a file for frontend use
  const fs = require('fs');
  const contractInfo = {
    address: contractAddress,
    verifier: verifierAddress,
    network: "sepolia",
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    './deployment-info.json', 
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
