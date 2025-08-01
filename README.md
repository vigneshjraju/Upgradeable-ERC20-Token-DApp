# 🔐 Upgradeable ERC20 Token

This project implements an **Upgradeable ERC20 Token** smart contract using the **UUPS proxy pattern** with **OpenZeppelin libraries**, including mint, burn, and redeem functionality. The DApp includes a **React.js frontend** for interacting with the token on the Ethereum Sepolia testnet.

## 🚀 Features

- 🔁 **Upgradeable** via UUPS Proxy
- 🪙 **Minting** for authorized minters
- 🔥 **Burning** by token holders
- 🎁 **Redeem** tokens for placeholder rewards (tracked by a counter)
- 👮 **Access Control** with roles (MINTER_ROLE, DEFAULT_ADMIN_ROLE)
- 💻 Frontend built with React + Vite + Ethers.js

## 🧱 Tech Stack

- **Solidity** (Upgradeable ERC20 Token)
- **OpenZeppelin** Contracts
- **Hardhat** (deployment, upgrade, test)
- **React.js** (frontend)
- **Sepolia** Ethereum testnet

## 📁 Project Structure

```
ERC-20_Token/
├── contracts/               # Smart contracts (TokenUpgradeable.sol, TokenUpgradeableV2.sol)
├── scripts/                # Manual deployment scripts (deployManual.js, grantMinter.js,upgrade.js)
├── test/                   # Hardhat test scripts
├── frontend/erc-20/        # React app (connect, mint, burn, redeem)
├── .env                    # Private key and RPC URL
├── hardhat.config.js       # Hardhat setup
└── README.md               # Project overview
```

## ⚙️ Setup

### 1. Install Dependencies

```bash
npm install
cd frontend/erc-20
npm install
```

### 2. Compile Contracts

```bash
npx hardhat compile
```

### 3. Deploy Manually

```bash
npx hardhat run scripts/deployManual.js --network sepolia
```

### 4. Grant Minter Role

```bash
npx hardhat run scripts/grantMinter.js --network sepolia
```

###  Upgrade to V2

```bash
After modifying TokenUpgradeableV2.sol, run:

npx hardhat run scripts/upgrade.js --network sepolia

```

### 5. Run Frontend

```bash
cd frontend/erc-20
npm run dev
```

## 🔒 Environment Variables

`.env` file example:

```
PRIVATE_KEY=your_private_key
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/your_api_key
ADMIN_ADDRESS=0xYourAdminAddress
```

## 🧪 Tests

```bash
npx hardhat test
```

## 🧠 Author

Vignesh J Raju — Blockchain Developer | Full Stack Engineer