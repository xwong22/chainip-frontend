// 'use client'

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { ethers } from "ethers";
// import CrowdfundingABI from "@/abi/Crowdfunding.json";
// import { CROWDFUNDING_CONTRACT_ADDRESS } from "@/config/contracts";

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

// export default function CampaignDetails() {
//   const params = useParams();
//   const id = params.id;
//   const [campaign, setCampaign] = useState<Campaign | null>(null);
//   const [contributionAmount, setContributionAmount] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (id) {
//       fetchCampaignDetails();
//     }
//   }, [id]);

//   async function fetchCampaignDetails() {
//     try {
//       // For now, use dummy data
//       const dummyCampaign = {
//         id: Number(id),
//         creator: "0x1234567890123456789012345678901234567890",
//         creatorName: "John Doe",
//         twitterHandle: "@johndoe",
//         projectName: "Decentralized AI Platform",
//         projectDescription: "Building an open-source AI platform that leverages blockchain for transparent model training and deployment.",
//         targetAmount: BigInt("5000000000000000000"), // 5 ETH
//         currentAmount: BigInt("2500000000000000000"), // 2.5 ETH
//         deadline: BigInt(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60),
//         finalized: false
//       };
//       setCampaign(dummyCampaign);
//     } catch (err) {
//       console.error("Error fetching campaign details:", err);
//       setError("Failed to load campaign details");
//     }
//   }

//   async function handleContribute() {
//     if (!campaign || !contributionAmount) return;

//     try {
//       setIsLoading(true);
//       setError("");

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const contract = new ethers.Contract(
//         CROWDFUNDING_CONTRACT_ADDRESS,
//         CrowdfundingABI,
//         signer
//       );

//       const tx = await contract.contribute(campaign.id, {
//         value: ethers.parseEther(contributionAmount)
//       });

//       await tx.wait();
//       await fetchCampaignDetails(); // Refresh campaign details
//       setContributionAmount("");
//     } catch (err) {
//       console.error("Error contributing:", err);
//       setError("Failed to process contribution");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   if (!campaign) {
//     return <div className="text-center py-12">Loading...</div>;
//   }

//   const progress = Number(ethers.formatEther(campaign.currentAmount)) / Number(ethers.formatEther(campaign.targetAmount)) * 100;
//   const daysLeft = Math.ceil((Number(campaign.deadline) * 1000 - Date.now()) / (1000 * 60 * 60 * 24));

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-3xl font-bold text-gray-900">{campaign.projectName}</h1>
//             <a 
//               href={`https://twitter.com/${campaign.twitterHandle.slice(1)}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 hover:text-blue-800"
//             >
//               {campaign.twitterHandle}
//             </a>
//           </div>

//           <div className="mb-8">
//             <p className="text-gray-600 text-lg leading-relaxed">
//               {campaign.projectDescription}
//             </p>
//           </div>

//           <div className="mb-8">
//             <div className="flex justify-between text-sm text-gray-600 mb-2">
//               <span>{ethers.formatEther(campaign.currentAmount)} ETH raised</span>
//               <span>{ethers.formatEther(campaign.targetAmount)} ETH goal</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-3">
//               <div 
//                 className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
//                 style={{ width: `${Math.min(progress, 100)}%` }}
//               ></div>
//             </div>
//             <div className="mt-2 text-sm text-gray-600">
//               <span className="font-medium">{daysLeft}</span> days left
//             </div>
//           </div>

//           <div className="border-t pt-6">
//             <h2 className="text-xl font-semibold mb-4">Make a Contribution</h2>
//             {error && (
//               <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
//                 {error}
//               </div>
//             )}
//             <div className="flex gap-4">
//               <input
//                 type="number"
//                 step="0.01"
//                 value={contributionAmount}
//                 onChange={(e) => setContributionAmount(e.target.value)}
//                 placeholder="Amount in ETH"
//                 className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//               <button
//                 onClick={handleContribute}
//                 disabled={isLoading || !contributionAmount}
//                 className={`px-6 py-2 rounded-lg text-white font-medium ${
//                   isLoading || !contributionAmount
//                     ? 'bg-gray-400 cursor-not-allowed'
//                     : 'bg-blue-600 hover:bg-blue-700'
//                 }`}
//               >
//                 {isLoading ? 'Contributing...' : 'Contribute'}
//               </button>
//             </div>
//           </div>

//           <div className="mt-6 text-sm text-gray-500">
//             <p>Campaign created by: {campaign.creatorName}</p>
//             <p className="font-mono">{campaign.creator}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
