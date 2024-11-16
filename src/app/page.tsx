'use client'

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CampaignForm from "@/components/CampaignForm";
import CampaignCard from "@/components/CampaignCard";
import CrowdfundingABI from "@/abi/Crowdfunding.json";

// Add this type declaration at the top of your file, after the imports
declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export default function Home() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string>("");

  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask) {
        const network = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Connected to network:', parseInt(network, 16)); // Will show chain ID

        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await web3Provider.getSigner();
        const crowdfundingContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CrowdfundingABI,
          signer
        );

        setAccount(accounts[0]);
        setProvider(web3Provider);
        setContract(crowdfundingContract);
        setIsConnected(true);
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  useEffect(() => {
    // Check if already connected
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connectWallet();
          }
        });
    }
  }, []);

  const fetchCampaigns = async () => {
    if (!contract) return;

    const fetchedCampaigns = [];
    const count = await contract.campaignCount();
    for (let i = 1; i <= count; i++) {
      const details = await contract.getCampaignDetails(i);
      fetchedCampaigns.push({ id: i, ...details });
    }
    setCampaigns(fetchedCampaigns);
  };

  useEffect(() => {
    if (contract) {
      fetchCampaigns();
    }
  }, [contract]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Crowdfunding DApp
          </h1>
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Connect MetaMask
            </button>
          ) : (
            <div className="text-sm text-gray-600">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
        </div>
        
        {isConnected ? (
          <>
            <div className="mb-12">
              <CampaignForm contract={contract} fetchCampaigns={fetchCampaigns} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600 mt-20">
            Please connect your MetaMask wallet to view campaigns
          </div>
        )}
      </div>
    </div>
  );
}
