// scripts/deployManual.js
const { ethers, upgrades } = require("hardhat");
require("dotenv").config();

async function main() {
  const Token = await ethers.getContractFactory("TokenUpgradeable");

  const proxy = await upgrades.deployProxy(
    Token,
    ["MyToken", "MTK", process.env.ADMIN_ADDRESS],
    {
      initializer: "initialize",
      kind: "uups",
    }
  );

  await proxy.waitForDeployment();
  console.log("✅ Proxy deployed to:", await proxy.getAddress());
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error.message);
  process.exit(1);
});
