// 'use client'

// import { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import { useRouter } from 'next/navigation';
// import CrowdfundingABI from '@/abi/Crowdfunding.json';
// import { CROWDFUNDING_CONTRACT_ADDRESS } from "@/config/contracts";


// export default function CreateCampaign() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [txStatus, setTxStatus] = useState('');
//   const [account, setAccount] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     creatorName: '',
//     twitterHandle: '',
//     projectName: '',
//     projectDescription: '',
//     targetAmount: '',
//     deadline: ''
//   });

//   // Check if wallet is connected
//   useEffect(() => {
//     checkWalletConnection();
//   }, []);

//   const checkWalletConnection = async () => {
//     try {
//       // First check if ethereum object exists
//       if (typeof window.ethereum === 'undefined') {
//         setTxStatus('Please install MetaMask to create a campaign.');
//         return;
//       }

//       // Add event listeners for account changes
//       window.ethereum.on('accountsChanged', (accounts: string[]) => {
//         if (accounts.length > 0) {
//           setAccount(accounts[0]);
//         } else {
//           setAccount(null);
//           setTxStatus('Please connect your wallet');
//         }
//       });

//       // Add event listeners for chain changes
//       window.ethereum.on('chainChanged', () => {
//         window.location.reload();
//       });

//       // Request accounts with error handling
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const accounts = await provider.listAccounts();
      
//       if (accounts.length > 0) {
//         setAccount(accounts[0].address);
//       }
//     } catch (error) {
//       console.error('Error checking wallet connection:', error);
//       setTxStatus('Unable to connect to MetaMask. Please try refreshing the page.');
//     }
//   };

//   const connectWallet = async () => {
//     try {
//       if (typeof window.ethereum === 'undefined') {
//         setTxStatus('Please install MetaMask to create a campaign.');
//         return;
//       }

//       setTxStatus('Connecting to wallet...');
      
//       // Request accounts access
//       try {
//         await window.ethereum.request({ 
//           method: 'eth_requestAccounts' 
//         });
//       } catch (error: any) {
//         if (error?.code === 4001) {
//           // User rejected the connection request
//           setTxStatus('Please connect your wallet to continue.');
//           return;
//         }
//         throw error;
//       }

//       // Get provider and accounts
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const accounts = await provider.listAccounts();
      
//       if (accounts.length > 0) {
//         setAccount(accounts[0].address);
//         setTxStatus('Wallet connected successfully!');
//       } else {
//         setTxStatus('Please unlock your MetaMask wallet.');
//       }
//     } catch (error) {
//       console.error('Error connecting wallet:', error);
//       setTxStatus('Failed to connect wallet. Please try again.');
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const checkNetwork = async () => {
//     try {
//       if (!window.ethereum) {
//         setTxStatus('Please install MetaMask');
//         return false;
//       }
      
//       const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
//       const expectedChainId = '0x539'; // 1337

//       console.log('chainId', chainId);
//       console.log('expectedChainId', expectedChainId);
      
//       if (chainId !== expectedChainId) {
//         setTxStatus('Please switch to the Hardhat network');
//         return false;
//       }
//       return true;
//     } catch (error) {
//       console.error('Error checking network:', error);
//       return false;
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!account) {
//       setTxStatus('Please connect your wallet first');
//       return;
//     }

//     if (!validateInputs()) {
//       return;
//     }

//     // Check network first
//     const isCorrectNetwork = await checkNetwork();
//     if (!isCorrectNetwork) {
//       return;
//     }

//     setIsLoading(true);
//     setTxStatus('Initializing transaction...');

//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
      
//       const contract = new ethers.Contract(
//         CROWDFUNDING_CONTRACT_ADDRESS,
//         CrowdfundingABI,
//         signer
//       );

//       // Convert ETH to Wei
//       const targetAmountWei = ethers.parseEther(formData.targetAmount);
      
//       // Convert deadline to Unix timestamp
//       const deadlineDate = new Date(formData.deadline);
//       const deadlineTimestamp = BigInt(Math.floor(deadlineDate.getTime() / 1000));

//       // First estimate gas to check if the transaction will fail
//       try {
//         console.log("estimating gas...")
//         await contract.initializeCampaign.estimateGas(
//           targetAmountWei,
//           deadlineTimestamp,
//           formData.creatorName,
//           formData.twitterHandle,
//           formData.projectName,
//           formData.projectDescription
//         );
//         console.log("estimating gas done")

//       } catch (error: any) {
//         console.error('Gas estimation failed:', error);
//         throw new Error('Transaction would fail. Please check your inputs and try again.');
//       }

//       setTxStatus('Please confirm the transaction in your wallet...');

//       console.log("targetAmountWei", targetAmountWei)
//       console.log("deadlineTimestamp", deadlineTimestamp)
//       console.log("formData.creatorName", formData.creatorName)
//       console.log("formData.twitterHandle", formData.twitterHandle)


//       // Call the contract function
//       const tx = await contract.initializeCampaign(
//         targetAmountWei,
//         deadlineTimestamp,
//         formData.creatorName,
//         formData.twitterHandle,
//         formData.projectName,
//         formData.projectDescription
//       );

//       setTxStatus('Transaction submitted! Waiting for confirmation...');
      
//       const receipt = await tx.wait();
      
//       setTxStatus('Transaction confirmed! Redirecting...');
      
//       setTimeout(() => {
//         router.push('/');
//       }, 2000);

//     } catch (error: any) {
//       console.error('Error creating campaign:', error);
//       if (error.reason) {
//         setTxStatus(`Transaction failed: ${error.reason}`);
//       } else if (error.message) {
//         setTxStatus(`Error: ${error.message}`);
//       } else {
//         setTxStatus('Transaction failed. Please try again.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const validateInputs = () => {
//     if (!formData.creatorName.trim()) {
//       setTxStatus('Creator name is required');
//       return false;
//     }
//     if (!formData.projectName.trim()) {
//       setTxStatus('Project name is required');
//       return false;
//     }
//     if (!formData.projectDescription.trim()) {
//       setTxStatus('Project description is required');
//       return false;
//     }
//     if (!formData.targetAmount || Number(formData.targetAmount) <= 0) {
//       setTxStatus('Target amount must be greater than 0');
//       return false;
//     }
//     if (!formData.deadline) {
//       setTxStatus('Deadline is required');
//       return false;
//     }
//     const deadlineDate = new Date(formData.deadline);
//     if (deadlineDate <= new Date()) {
//       setTxStatus('Deadline must be in the future');
//       return false;
//     }
//     return true;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
//         <h1 className="text-2xl font-bold mb-6">Create New Campaign</h1>
        
//         {/* Wallet Connection Status */}
//         {!account && (
//           <div className="mb-6">
//             <button
//               onClick={connectWallet}
//               className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
//             >
//               Connect Wallet to Create Campaign
//             </button>
//           </div>
//         )}

//         {/* Transaction Status */}
//         {txStatus && (
//           <div className={`mb-4 p-4 rounded-lg ${
//             txStatus.includes('failed') || txStatus.includes('Please')
//               ? 'bg-red-100 text-red-700' 
//               : 'bg-blue-100 text-blue-700'
//           }`}>
//             <div className="flex items-center">
//               {isLoading && (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
//               )}
//               {txStatus}
//             </div>
//           </div>
//         )}

//         {/* Only show form if wallet is connected */}
//         {account && (
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="creatorName" className="block text-sm font-medium text-gray-700">
//                 Creator Name
//               </label>
//               <input
//                 type="text"
//                 name="creatorName"
//                 id="creatorName"
//                 required
//                 value={formData.creatorName}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label htmlFor="twitterHandle" className="block text-sm font-medium text-gray-700">
//                 Twitter Handle
//               </label>
//               <input
//                 type="text"
//                 name="twitterHandle"
//                 id="twitterHandle"
//                 value={formData.twitterHandle}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
//                 Project Name
//               </label>
//               <input
//                 type="text"
//                 name="projectName"
//                 id="projectName"
//                 required
//                 value={formData.projectName}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
//                 Project Description
//               </label>
//               <textarea
//                 name="projectDescription"
//                 id="projectDescription"
//                 required
//                 value={formData.projectDescription}
//                 onChange={handleChange}
//                 rows={4}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
//                 Target Amount (ETH)
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 name="targetAmount"
//                 id="targetAmount"
//                 required
//                 value={formData.targetAmount}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
//                 Deadline
//               </label>
//               <input
//                 type="datetime-local"
//                 name="deadline"
//                 id="deadline"
//                 required
//                 value={formData.deadline}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`px-4 py-2 rounded-md text-white ${
//                   isLoading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-blue-600 hover:bg-blue-700'
//                 }`}
//               >
//                 {isLoading ? 'Creating Campaign...' : 'Create Campaign'}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }