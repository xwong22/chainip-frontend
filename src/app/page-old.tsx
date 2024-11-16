// 'use client'

// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import CampaignCard from "@/components/CampaignCard";
// import CrowdfundingABI from "@/abi/Crowdfunding.json";
// import Link from 'next/link';
// import Header from '@/components/Header';

// import { CROWDFUNDING_CONTRACT_ADDRESS } from "@/config/contracts";

// import {
//   DynamicContextProvider,
// } from "@dynamic-labs/sdk-react-core";

// import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

// interface Campaign {
//   id: number;
//   creator: string;
//   creatorName: string;
//   twitterHandle: string;
//   projectName: string;
//   projectDescription: string;
//   targetAmount: bigint;
//   currentAmount: bigint;
//   deadline: bigint;
//   finalized: boolean;
// }

// // Add dummy data with correct types matching the contract
// const DUMMY_CAMPAIGNS: Campaign[] = [
//   {
//     id: 1,
//     creator: "0x1234567890123456789012345678901234567890",
//     creatorName: "John Doe",
//     twitterHandle: "@johndoe",
//     projectName: "Decentralized AI Platform",
//     projectDescription: "Building an open-source AI platform that leverages blockchain for transparent model training and deployment.",
//     targetAmount: BigInt("5000000000000000000"), // 5 ETH
//     currentAmount: BigInt("2500000000000000000"), // 2.5 ETH
//     deadline: BigInt(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60), // 7 days from now
//     finalized: false
//   },
//   {
//     id: 2,
//     creator: "0x2345678901234567890123456789012345678901",
//     creatorName: "Alice Smith",
//     twitterHandle: "@alicesmith",
//     projectName: "Green Energy NFTs",
//     projectDescription: "Creating NFTs that represent renewable energy credits, making green energy investments more accessible.",
//     targetAmount: BigInt("3000000000000000000"), // 3 ETH
//     currentAmount: BigInt("1000000000000000000"), // 1 ETH
//     deadline: BigInt(Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60), // 14 days from now
//     finalized: false
//   },
//   {
//     id: 3,
//     creator: "0x3456789012345678901234567890123456789012",
//     creatorName: "Bob Wilson",
//     twitterHandle: "@bobwilson",
//     projectName: "DeFi Education Platform",
//     projectDescription: "An interactive learning platform teaching DeFi concepts through hands-on simulations.",
//     targetAmount: BigInt("8000000000000000000"), // 8 ETH
//     currentAmount: BigInt("4000000000000000000"), // 4 ETH
//     deadline: BigInt(Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60), // 5 days from now
//     finalized: false
//   }
// ];

// export default function Home() {
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
//   const [contract, setContract] = useState<ethers.Contract | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const connectWallet = async () => {
//     try {
//       if (typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask) {
//         const network = await window.ethereum.request({ method: 'eth_chainId' });
//         console.log('Connected to network:', parseInt(network, 16));

//         const accounts = await window.ethereum.request({ 
//           method: 'eth_requestAccounts' 
//         });
        
//         const web3Provider = new ethers.BrowserProvider(window.ethereum);
//         const signer = await web3Provider.getSigner();
        
//         console.log("Contract address:", CROWDFUNDING_CONTRACT_ADDRESS);
//         console.log("Connected account:", accounts[0]);
        
//         const crowdfundingContract = new ethers.Contract(
//           CROWDFUNDING_CONTRACT_ADDRESS,
//           CrowdfundingABI,
//           signer
//         );
        
//         console.log("Contract instance:", crowdfundingContract);
        
//         try {
//           const code = await web3Provider.getCode(CROWDFUNDING_CONTRACT_ADDRESS);
//           console.log("Contract code exists:", code !== "0x");
//         } catch (error) {
//           console.error("Error checking contract code:", error);
//         }

//         setProvider(web3Provider);
//         setContract(crowdfundingContract);
//       } else {
//         alert("Please install MetaMask!");
//       }
//     } catch (error) {
//       console.error("Error connecting to MetaMask:", error);
//     }
//   };

//   const fetchCampaigns = async () => {
//     setIsLoading(true);
//     try {
//       // Comment out contract interaction for now
//       // const count = await contract.campaignCount();
//       // ... previous contract code ...

//       // Instead, use dummy data
//       setCampaigns(DUMMY_CAMPAIGNS);
//     } catch (error) {
//       console.error("Error fetching campaigns:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (window.ethereum && window.ethereum.isMetaMask) {
//       window.ethereum.request({ method: 'eth_accounts' })
//         .then((accounts: string[]) => {
//           if (accounts.length > 0) {
//             connectWallet();
//           }
//         });
//     }
//   }, []);

//   useEffect(() => {
//     fetchCampaigns();
//   }, []);

//   return (
//     <DynamicContextProvider
//       settings={{
//         // Find your environment id at https://app.dynamic.xyz/dashboard/developer
//         environmentId: "REPLACE-WITH-YOUR-ENVIRONMENT-ID",
        
//         walletConnectors: [EthereumWalletConnectors],
//       }}
//     >
//     <div className="min-h-screen bg-gray-50">
//       <Header />
      
//       <main className="max-w-6xl mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-800">Active Campaigns</h2>
//           <p className="text-gray-600 mt-2">Support innovative projects and earn shares in their success</p>
//         </div>

//         {isLoading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {campaigns.map((campaign) => (
//               <CampaignCard key={campaign.id} campaign={campaign} />
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//     </DynamicContextProvider>

//   );
// }
