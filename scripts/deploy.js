// scripts/deploy.js

import hre from "hardhat";

async function main() {
  const Medxact = await hre.ethers.getContractFactory("Medxact");
  const medxact = await Medxact.deploy();

  await medxact.waitForDeployment();

  console.log(`Medxact deployed to: ${medxact.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
