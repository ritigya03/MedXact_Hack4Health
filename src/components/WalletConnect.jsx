import React, { useState } from "react";
import { BrowserProvider } from "ethers";

const WalletConnect = () => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Create a new provider
        const provider = new BrowserProvider(window.ethereum);

        // Get the signer
        const signer = await provider.getSigner();

        // Get the wallet address
        const address = await signer.getAddress();

        // Set the state
        setAccount(address);
        setIsConnected(true);
        console.log("Connected Account:", address);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("MetaMask not detected! Please install MetaMask.");
    }
  };

  return (
    <div className="flex p-8 shadow-md shadow-green-500 flex-col items-center justify-center p-4">
     

      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="bg-green-700 hover:bg-green-900 text-white font-medium py-3 px-8 rounded"
        >
          Connect MetaMask
        </button>
      ) : (
        <div className="text-green-600  font-mono">
          <p >✅ Connected</p>
          <p className="break-all text-sm">Address: {account}</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
