import { ethers } from "ethers";
import MedxactABI from "./MedxactABI.json";

const CONTRACT_ADDRESS = "0x83864190F75ff1d2b5eEb914ee23eC3D280Bd6BE";

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found");

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, MedxactABI, signer);
};
