import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI } from "./abi/abi.js";

const CONTRACT_ADDRESS = "0x8c6c2681B423D65093cF159817b47dbfFbaC8aC4"; // Replace with your deployed proxy address

function App() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");

  // Connect wallet and contract
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAccount(userAddress);

      const token = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(token);

      const bal = await token.balanceOf(userAddress);
      setBalance(bal.toString());
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Update balance
  const updateBalance = async () => {
    if (contract && account) {
      const bal = await contract.balanceOf(account);
      setBalance(bal.toString());
    }
  };

  // Mint tokens
  const mint = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.mint(account, ethers.parseUnits("1000", 18));
      await tx.wait();
      alert("Minted 1000 tokens!");
      updateBalance();
    } catch (err) {
      alert("Mint failed: " + err.message);
    }
    setLoading(false);
  };

  // Burn tokens
  const burn = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.burn(ethers.parseUnits("100", 18));
      await tx.wait();
      alert("Burned 100 tokens!");
      updateBalance();
    } catch (err) {
      alert("Burn failed: " + err.message);
    }
    setLoading(false);
  };

  // Redeem tokens
  const redeem = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.redeem(ethers.parseUnits("50", 18));
      await tx.wait();
      alert("Redeemed 50 tokens!");
      updateBalance();
    } catch (err) {
      alert("Redeem failed: " + err.message);
    }
    setLoading(false);
  };

  // Send tokens to another address
  const sendTokens = async () => {
    if (!contract) return;
    if (!ethers.isAddress(recipient)) {
      alert("Invalid recipient address!");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.transfer(recipient, ethers.parseUnits(sendAmount, 18));
      await tx.wait();
      alert(`Sent ${sendAmount} tokens to ${recipient}`);
      updateBalance();
    } catch (err) {
      alert("Send failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Upgradeable ERC20 DApp</h2>

        <button
          onClick={connectWallet}
          className="w-full mb-4 py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Connect Wallet
        </button>

        <div className="mb-2 text-gray-700"><strong>Account:</strong> {account || "Not connected"}</div>
        <div className="mb-6 text-gray-700"><strong>Balance:</strong> {balance}</div>

        <div className="flex flex-col gap-3">
          <button
            onClick={mint}
            disabled={loading}
            className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
          >
            Mint 1000
          </button>

          <button
            onClick={burn}
            disabled={loading}
            className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50"
          >
            Burn 100
          </button>

          <button
            onClick={redeem}
            disabled={loading}
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            Redeem 50
          </button>
        </div>

        {/* Send Tokens Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Send Tokens</h3>
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={sendTokens}
            disabled={loading}
            className="py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition disabled:opacity-50"
          >
            Send Tokens
          </button>
        </div>

        {loading && <div className="mt-4 text-center text-gray-500">Processing...</div>}
      </div>
    </div>
  );
}

export default App;
