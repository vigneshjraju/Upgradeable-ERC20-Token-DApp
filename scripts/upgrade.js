require("dotenv").config();
const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0x8c6c2681B423D65093cF159817b47dbfFbaC8aC4"; 

  const TokenV2 = await ethers.getContractFactory("TokenUpgradeableV2");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, TokenV2);

  console.log("Upgrade successful. Proxy is still at:", upgraded.target);
  console.log("Version:", await upgraded.version());
}

main().catch((err) => {
  console.error("Upgrade failed:", err.message);
  process.exit(1);
});
