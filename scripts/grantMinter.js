require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  const proxyAddress = "0x8c6c2681B423D65093cF159817b47dbfFbaC8aC4"; // <-- replace this
  const minterAddress = process.env.ADMIN_ADDRESS;

  const artifactPath = path.join(__dirname, "../artifacts/contracts/TokenUpgradeable.sol/TokenUpgradeable.json");
  const tokenArtifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const abi = tokenArtifact.abi;

  // ✅ Explicitly pass network name as fallback
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL, "sepolia");

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const token = new ethers.Contract(proxyAddress, abi, signer);

  const adminRole = await token.DEFAULT_ADMIN_ROLE();
  const isAdmin = await token.hasRole(adminRole, signer.address);
  console.log("Signer address:", signer.address);
  console.log("Has DEFAULT_ADMIN_ROLE?", isAdmin);

  if (!isAdmin) {
    throw new Error("Signer does not have DEFAULT_ADMIN_ROLE — cannot grant MINTER_ROLE");
  }

  const tx = await token.grantRole(await token.MINTER_ROLE(), minterAddress);
  await tx.wait();

  console.log(`✅ Granted MINTER_ROLE to ${minterAddress}`);
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
