const hre = require("hardhat");

async function main() {
  const memoxAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const MEMOX = await hre.ethers.getContractFactory("MEMOXToken");
  const memox = await MEMOX.attach(memoxAddress);

  const [owner] = await hre.ethers.getSigners();
  const balance = await memox.balanceOf(owner.address);

  console.log(`🪙 Owner balance: ${hre.ethers.formatUnits(balance, 18)} MEMOX`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
