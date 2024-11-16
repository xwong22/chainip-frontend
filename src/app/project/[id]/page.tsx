'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useParams } from 'next/navigation';
import { CROWDFUNDING_CONTRACT_ADDRESS } from '@/config/contracts';
import CrowdfundingABI from '@/abi/Crowdfunding.json';

interface ProjectDetails {
  creator: string;
  creatorName: string;
  twitterHandle: string;
  projectName: string;
  projectDescription: string;
  targetAmount: string;
  currentAmount: string;
  deadline: number;
  finalized: boolean;
  projectImage: string;
  contributors: {
    address: string;
    amount: string;
  }[];
  requestors: {
    address: string;
    details: string;
    timestamp: number;
  }[];
  accumulatedProfits: string;
}

const IP_REQUEST_PRICE = "0.5"; // 0.5 ETH fixed price for IP requests

const dummyProjects: Record<string, ProjectDetails> = {
  "1": {
    // Ongoing Project
    creator: "0x1234567890123456789012345678901234567890",
    creatorName: "Alice Johnson",
    twitterHandle: "@alice_web3",
    projectName: "Decentralized Patent Registry",
    projectDescription: "Building a decentralized system for patent registration and management using blockchain technology. This platform will revolutionize how intellectual property is registered, tracked, and traded in the digital age.",
    targetAmount: "10.0",
    currentAmount: "6.5",
    deadline: Math.floor(Date.now() / 1000) + 864000, // 10 days from now
    finalized: false,
    projectImage: "https://picsum.photos/seed/patent1/800/400",
    contributors: [
      {
        address: "0xabcd...1234",
        amount: "3.0"
      },
      {
        address: "0xefgh...5678",
        amount: "2.0"
      },
      {
        address: "0xijkl...9012",
        amount: "1.5"
      }
    ],
    requestors: [], // No requestors for ongoing project
    accumulatedProfits: "0"
  },
  "2": {
    // Successful Project
    creator: "0x2345678901234567890123456789012345678901",
    creatorName: "Bob Smith",
    twitterHandle: "@bob_builds",
    projectName: "Smart Contract IP Marketplace",
    projectDescription: "A successful marketplace for trading intellectual property rights using smart contracts. The platform includes automated licensing, royalty distributions, and transparent tracking of IP ownership.",
    targetAmount: "15.0",
    currentAmount: "17.5",
    deadline: Math.floor(Date.now() / 1000) - 864000, // 10 days ago
    finalized: true,
    projectImage: "https://picsum.photos/seed/patent2/800/400",
    contributors: [
      {
        address: "0xmnop...3456",
        amount: "5.0"
      },
      {
        address: "0xqrst...7890",
        amount: "7.5"
      },
      {
        address: "0xuvwx...1234",
        amount: "5.0"
      }
    ],
    requestors: [
      {
        address: "0xabcd...5678",
        details: "Planning to integrate this marketplace into our existing DeFi platform to enable IP-backed lending.",
        timestamp: Math.floor(Date.now() / 1000) - 172800 // 2 days ago
      },
      {
        address: "0xefgh...9012",
        details: "Would like to use this for our university's research commercialization program.",
        timestamp: Math.floor(Date.now() / 1000) - 86400 // 1 day ago
      }
    ],
    accumulatedProfits: "0"
  }
};

const calculateProfit = (contributorAmount: string, totalAmount: string, accumulatedProfits: string) => {
  const percentage = (Number(contributorAmount) / Number(totalAmount)) * 100;
  const profit = Number(accumulatedProfits) * (percentage / 100);
  return { percentage: percentage.toFixed(1), profit: profit.toFixed(2) };
};

export default function ProjectDetails() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [contribution, setContribution] = useState('');
  const [requestDetails, setRequestDetails] = useState('');

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const projectData = dummyProjects[id];
        if (projectData) {
          setProject(projectData);
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const handleContribute = async () => {
    if (!contribution || loading) return;
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use a more realistic dummy address
      const userAddress = "0xyzab...7890";
      
      setProject(prev => {
        if (!prev) return prev;
        
        const newAmount = (Number(prev.currentAmount) + Number(contribution)).toString();
        const existingContributorIndex = prev.contributors.findIndex(
          c => c.address === userAddress
        );

        let updatedContributors;
        if (existingContributorIndex >= 0) {
          // Update existing contributor
          updatedContributors = prev.contributors.map((c, i) => 
            i === existingContributorIndex 
              ? { ...c, amount: (Number(c.amount) + Number(contribution)).toString() }
              : c
          );
        } else {
          // Add new contributor
          updatedContributors = [
            ...prev.contributors,
            { address: userAddress, amount: contribution }
          ];
        }

        return {
          ...prev,
          currentAmount: newAmount,
          contributors: updatedContributors
        };
      });

      setContribution('');
      alert('Contribution successful!');
    } catch (error) {
      console.error('Error contributing:', error);
      alert('Error making contribution. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleIPRequest = async () => {
    if (!requestDetails || loading) return;
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userAddress = "0xyzab...7890";
      
      setProject(prev => {
        if (!prev) return prev;
        
        // Add the IP request price to accumulated profits
        const newAccumulatedProfits = (
          Number(prev.accumulatedProfits || "0") + Number(IP_REQUEST_PRICE)
        ).toString();
        
        // Calculate and display individual profit distributions
        const profitMessage = prev.contributors.map(contributor => {
          const { percentage, profit } = calculateProfit(
            contributor.amount,
            prev.currentAmount,
            newAccumulatedProfits
          );
          return `${contributor.address}: ${profit} ETH (${percentage}%)`;
        }).join('\n');
        
        setTimeout(() => {
          alert(`IP request successful! Paid ${IP_REQUEST_PRICE} ETH\n\nProfit Distribution:\n${profitMessage}`);
        }, 500);
        
        return {
          ...prev,
          accumulatedProfits: newAccumulatedProfits,
          requestors: [
            ...prev.requestors,
            {
              address: userAddress,
              details: requestDetails,
              timestamp: Math.floor(Date.now() / 1000)
            }
          ]
        };
      });

      setRequestDetails('');
    } catch (error) {
      console.error('Error submitting IP request:', error);
      alert('Error submitting request. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-4">
      <h1 className="text-3xl font-bold mb-6">{project.projectName}</h1>
      
      {project.projectImage && (
        <div className="mb-6">
          <img 
            src={project.projectImage} 
            alt={project.projectName}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Project Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-sm text-gray-600">Creator</h2>
            <p className="font-medium">{project.creatorName}</p>
            <p className="text-blue-500">{project.twitterHandle}</p>
          </div>
          <div>
            <h2 className="text-sm text-gray-600">Wallet Address</h2>
            <p className="font-mono text-sm">{project.creator}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-sm text-gray-600 mb-2">Project Description</h2>
          <p className="text-gray-800">{project.projectDescription}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <h2 className="text-sm text-gray-600">Target Amount</h2>
            <p className="font-medium">{project.targetAmount} ETH</p>
          </div>
          <div>
            <h2 className="text-sm text-gray-600">Current Amount</h2>
            <p className="font-medium">{project.currentAmount} ETH</p>
          </div>
          <div>
            <h2 className="text-sm text-gray-600">Deadline</h2>
            <p className="font-medium">{new Date(project.deadline * 1000).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Contribution Section for Ongoing Campaigns */}
      {!project.finalized && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-blue-800 font-medium text-center">
              Support this project by contributing ETH
            </p>
            <div className="w-full space-y-4">
              <div className="flex gap-4">
                <input
                  type="number"
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  placeholder="Amount in ETH"
                  step="0.01"
                  min="0"
                  className="flex-1 p-3 border rounded-lg"
                />
                <button
                  onClick={handleContribute}
                  disabled={!contribution || loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Contributing...' : 'Contribute'}
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ 
                    width: `${Math.min(
                      (Number(project.currentAmount) / Number(project.targetAmount)) * 100, 
                      100
                    )}%` 
                  }}
                />
              </div>
              
              {/* Campaign Progress Stats */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  Raised: {project.currentAmount} ETH
                </span>
                <span>
                  Target: {project.targetAmount} ETH
                </span>
              </div>
              
              {/* Time Remaining */}
              <div className="text-center text-sm text-gray-600">
                {project.deadline > Math.floor(Date.now() / 1000) ? (
                  <span>
                    Ends in: {Math.ceil((project.deadline - Math.floor(Date.now() / 1000)) / (24 * 60 * 60))} days
                  </span>
                ) : (
                  <span className="text-red-600">Campaign has ended</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {project.finalized && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-green-800 font-medium text-center">
              This campaign was successfully funded! You can now request to use the IP.
            </p>
            <p className="text-gray-600 text-center">
              IP Request Price: {IP_REQUEST_PRICE} ETH
            </p>
            <div className="w-full space-y-4">
              <textarea
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Describe how you plan to use this IP..."
                rows={4}
              />
              <button
                onClick={handleIPRequest}
                className="w-full px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit IP Usage Request ({IP_REQUEST_PRICE} ETH)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contributors and Requestors Grid - Modified for conditional layout */}
      <div className={`grid grid-cols-1 ${project.finalized ? 'md:grid-cols-2' : ''} gap-6`}>
        {/* Contributors Section - Now full width for ongoing campaigns */}
        <div className={`bg-white rounded-lg shadow-lg p-6 ${project.finalized ? '' : 'md:col-span-2'}`}>
          <h2 className="text-xl font-semibold mb-4">Contributors</h2>
          <div className="divide-y">
            {project.contributors.length > 0 ? (
              project.contributors.map((contributor, index) => {
                const { percentage, profit } = calculateProfit(
                  contributor.amount,
                  project.currentAmount,
                  project.accumulatedProfits
                );
                return (
                  <div key={index} className="py-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-mono text-sm">{contributor.address}</div>
                      <div className="font-medium">{contributor.amount} ETH</div>
                    </div>
                    
                    {/* Contribution percentage visualization */}
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            {percentage}% of total contributions
                          </span>
                        </div>
                        {project.finalized && (
                          <div>
                            <span className="text-xs font-semibold inline-block text-green-600">
                              Profit: {profit} ETH
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-100">
                        <div
                          style={{ width: `${percentage}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 py-4">No contributors yet</p>
            )}
            
            {/* Total Statistics */}
            {project.contributors.length > 0 && (
              <div className="pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Total Contributions</span>
                  <span className="font-medium">{project.currentAmount} ETH</span>
                </div>
                {project.finalized && (
                  <>
                    <div className="flex justify-between items-center text-blue-600">
                      <span className="font-semibold">IP Request Profits</span>
                      <span className="font-medium">
                        {project.accumulatedProfits} ETH
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Requestors Section - Only shows for finalized campaigns */}
        {project.finalized && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">IP Usage Requests History</h2>
            <div className="divide-y">
              {project.requestors && project.requestors.length > 0 ? (
                project.requestors.map((requestor, index) => (
                  <div key={index} className="py-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-mono text-sm">{requestor.address}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(requestor.timestamp * 1000).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{requestor.details}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 py-4">No IP usage requests yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
