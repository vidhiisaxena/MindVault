const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with:", deployer.address);

  const Token = await hre.ethers.getContractFactory("MEMOXToken");
  const token = await Token.deploy();
  await token.waitForDeployment();

  console.log("MEMOXToken deployed to:", await token.getAddress());

  // Mint to your imported MetaMask address
  const recipient = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199"; // Update if needed
  await token.mint(recipient, hre.ethers.parseUnits("1000", 18));

  console.log(`Minted 1000 MEMOX to ${recipient}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
