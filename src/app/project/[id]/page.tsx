'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useParams } from 'next/navigation';
import { CROWDFUNDING_CONTRACT_ADDRESS } from '@/config/contracts';
import CrowdfundingABI from '@/abi/Crowdfunding.json';
import AiPriceEstimator, { AIClient } from '@/components/AiPriceEstimator';
import { createNotaryAttestation } from '@/scripts/createAttestation';

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

export const dummyProjects: Record<string, ProjectDetails> = {
  "1": {
    creator: "0x1234567890123456789012345678901234567890",
    creatorName: "Dr. Sarah Chen",
    twitterHandle: "@greenbuilding_tech",
    projectName: "Green Building Materials Patent Development",
    projectDescription: "A startup develops eco-friendly building materials to replace cement and reduce carbon emissions; benefits include patent licensing profit-sharing, early product access, and limited-edition material models for early investors.",
    targetAmount: "12.0",
    currentAmount: "8.5",
    deadline: Math.floor(Date.now() / 1000) + 864000, // 10 days from now
    finalized: false,
    projectImage: "https://picsum.photos/seed/green1/800/400",
    contributors: [
      { address: "0x6373336291468Cb9463d131aF8069a52cda3A537", amount: "4.5" },
      { address: "0xa2C9b0F51Cf90cf3659a15963CA58E4058111cBF", amount: "4.0" }
    ],
    requestors: [],
    accumulatedProfits: "0"
  },
  "2": {
    creator: "0x2345678901234567890123456789012345678901",
    creatorName: "Dr. James Wilson",
    twitterHandle: "@ai_medical",
    projectName: "AI Medical Diagnosis Technology",
    projectDescription: "A research team creates AI algorithms for early cancer detection to improve diagnostics and lower costs; benefits include patent revenue sharing, early access for healthcare providers, and free health consultations for small supporters.",
    targetAmount: "20.0",
    currentAmount: "22.5",
    deadline: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
    finalized: true,
    projectImage: "https://picsum.photos/seed/medical2/800/400",
    contributors: [
      { address: "0x6373336291468Cb9463d131aF8069a52cda3A537", amount: "10.0" },
      { address: "0x91c871d879e5d885e06dE58979986137b032724b", amount: "12.5" }
    ],
    requestors: [
      {
        address: "0xqrst...7890",
        details: "Planning to implement in our regional hospital network",
        timestamp: Math.floor(Date.now() / 1000) - 86400
      }
    ],
    accumulatedProfits: "1.5"
  },
  "3": {
    creator: "0x3456789012345678901234567890123456789012",
    creatorName: "Dr. Marina Costa",
    twitterHandle: "@oceancleanup_tech",
    projectName: "Pollution-Free Ocean Plastic Recycling Device",
    projectDescription: "A company develops a device using photocatalytic technology to break down ocean plastics; benefits include proportional patent revenue sharing, investor names on initial devices, and participation in marine conservation events.",
    targetAmount: "15.0",
    currentAmount: "16.2",
    deadline: Math.floor(Date.now() / 1000) - 259200, // 3 days ago
    finalized: true,
    projectImage: "https://picsum.photos/seed/ocean3/800/400",
    contributors: [
      { address: "0xa2C9b0F51Cf90cf3659a15963CA58E4058111cBF", amount: "8.0" },
      { address: "0x91c871d879e5d885e06dE58979986137b032724b", amount: "5.2" },
      { address: "0x6373336291468Cb9463d131aF8069a52cda3A537", amount: "3.0" }
    ],
    requestors: [
      {
        address: "0xenv1...7890",
        details: "Interested in deploying in Pacific Ocean cleanup initiative",
        timestamp: Math.floor(Date.now() / 1000) - 172800
      }
    ],
    accumulatedProfits: "2.0"
  },
  "4": {
    creator: "0x4567890123456789012345678901234567890123",
    creatorName: "Prof. David Zhang",
    twitterHandle: "@agritech_drones",
    projectName: "Precision Agriculture Drone Technology",
    projectDescription: "Engineers design drones with multispectral sensors to optimize farming practices; benefits include patent licensing profit-sharing, discounts on early devices for large investors, and participation in public testing.",
    targetAmount: "18.0",
    currentAmount: "12.5",
    deadline: Math.floor(Date.now() / 1000) + 1209600, // 14 days from now
    finalized: false,
    projectImage: "https://picsum.photos/seed/drone4/800/400",
    contributors: [
      { address: "0x6373336291468Cb9463d131aF8069a52cda3A537", amount: "7.0" },
      { address: "0xa2C9b0F51Cf90cf3659a15963CA58E4058111cBF", amount: "5.5" }
    ],
    requestors: [],
    accumulatedProfits: "0"
  },
  "5": {
    creator: "0x5678901234567890123456789012345678901234",
    creatorName: "Dr. Emily Roberts",
    twitterHandle: "@battery_tech",
    projectName: "Long-Life Rechargeable Battery Technology",
    projectDescription: "A university team works on solid-state batteries for faster charging and improved lifespan, especially for EVs; benefits include profit-sharing from commercialization, licensing priority for manufacturers, and lab visit opportunities.",
    targetAmount: "25.0",
    currentAmount: "27.8",
    deadline: Math.floor(Date.now() / 1000) - 432000, // 5 days ago
    finalized: true,
    projectImage: "https://picsum.photos/seed/battery5/800/400",
    contributors: [
      { address: "0x91c871d879e5d885e06dE58979986137b032724b", amount: "15.0" },
      { address: "0x6373336291468Cb9463d131aF8069a52cda3A537", amount: "8.8" },
      { address: "0xa2C9b0F51Cf90cf3659a15963CA58E4058111cBF", amount: "4.0" }
    ],
    requestors: [
      {
        address: "0xmanf...7890",
        details: "EV manufacturer interested in licensing for production",
        timestamp: Math.floor(Date.now() / 1000) - 259200
      }
    ],
    accumulatedProfits: "3.5"
  },
  "6": {
    creator: "0x6789012345678901234567890123456789012345",
    creatorName: "Dr. Aisha Patel",
    twitterHandle: "@clean_water",
    projectName: "Low-Cost Water Filtration Technology",
    projectDescription: "A nonprofit develops nanomembrane filtration systems for clean drinking water in remote regions; benefits include patent revenue donations to environmental causes, technology use priority for humanitarian efforts, and supporter recognition.",
    targetAmount: "10.0",
    currentAmount: "7.2",
    deadline: Math.floor(Date.now() / 1000) + 691200, // 8 days from now
    finalized: false,
    projectImage: "https://picsum.photos/seed/water6/800/400",
    contributors: [
      { address: "0x6373336291468Cb9463d131aF8069a52cda3A537", amount: "4.2" },
      { address: "0x91c871d879e5d885e06dE58979986137b032724b", amount: "3.0" }
    ],
    requestors: [],
    accumulatedProfits: "0"
  },
  "7": {
    creator: "0x7890123456789012345678901234567890123456",
    creatorName: "Dr. Marcus Chen",
    twitterHandle: "@space_cleanup",
    projectName: "Space Debris Cleanup Device",
    projectDescription: "An aerospace company creates devices to collect and recycle space debris, reducing spacecraft collision risks; benefits include patent licensing revenue sharing, custom space models for enthusiasts, and livestream invites for first missions.",
    targetAmount: "30.0",
    currentAmount: "22.5",
    deadline: Math.floor(Date.now() / 1000) + 1728000, // 20 days from now
    finalized: false,
    projectImage: "https://picsum.photos/seed/space7/800/400",
    contributors: [
      { address: "0xa2C9b0F51Cf90cf3659a15963CA58E4058111cBF", amount: "12.0" },
      { address: "0x6373336291468Cb9463d131aF8069a52cda3A537", amount: "10.5" }
    ],
    requestors: [],
    accumulatedProfits: "0"
  },
  "8": {
    creator: "0x8901234567890123456789012345678901234567",
    creatorName: "Dr. Sophie Anderson",
    twitterHandle: "@biotech_coating",
    projectName: "Smart Antimicrobial Coating Technology",
    projectDescription: "A biotech firm develops real-time antimicrobial coatings for hospitals and public spaces; benefits include revenue from patent licensing, free trials for institutions, and portable antimicrobial products for individual investors.",
    targetAmount: "22.0",
    currentAmount: "23.5",
    deadline: Math.floor(Date.now() / 1000) - 345600, // 4 days ago
    finalized: true,
    projectImage: "https://picsum.photos/seed/biotech8/800/400",
    contributors: [
      { address: "0x91c871d879e5d885e06dE58979986137b032724b", amount: "12.0" },
      { address: "0x6373336291468Cb9463d131aF8069a52cda3A537", amount: "11.5" }
    ],
    requestors: [
      {
        address: "0xhosp...7890",
        details: "Hospital chain interested in implementing in ICU units",
        timestamp: Math.floor(Date.now() / 1000) - 172800
      }
    ],
    accumulatedProfits: "1.8"
  },
  "9": {
    creator: "0x9012345678901234567890123456789012345678",
    creatorName: "Dr. Thomas Brown",
    twitterHandle: "@eco_packaging",
    projectName: "Biodegradable Packaging Material",
    projectDescription: "Researchers develop plant-based biodegradable packaging for food and logistics; benefits include patent revenue sharing, eco-friendly sample packs, and invitations to research progress meetings for major backers.",
    targetAmount: "16.0",
    currentAmount: "11.8",
    deadline: Math.floor(Date.now() / 1000) + 432000, // 5 days from now
    finalized: false,
    projectImage: "https://picsum.photos/seed/package9/800/400",
    contributors: [
      { address: "0xa2C9b0F51Cf90cf3659a15963CA58E4058111cBF", amount: "6.8" },
      { address: "0x91c871d879e5d885e06dE58979986137b032724b", amount: "5.0" }
    ],
    requestors: [],
    accumulatedProfits: "0"
  },
  "10": {
    creator: "0x0123456789012345678901234567890123456789",
    creatorName: "Dr. Michael Lee",
    twitterHandle: "@renewable_power",
    projectName: "Renewable Energy Micro Turbine Generator",
    projectDescription: "Engineers design low-cost, small-scale wind turbines for home use to meet daily power needs; benefits include patent licensing and sales revenue, early device access for large backers, and launch ceremony invites for investors.",
    targetAmount: "14.0",
    currentAmount: "15.2",
    deadline: Math.floor(Date.now() / 1000) - 518400, // 6 days ago
    finalized: true,
    projectImage: "https://picsum.photos/seed/turbine10/800/400",
    contributors: [
      { address: "0x6373336291468Cb9463d131aF8069a52cda3A537", amount: "8.0" },
      { address: "0xa2C9b0F51Cf90cf3659a15963CA58E4058111cBF", amount: "7.2" }
    ],
    requestors: [
      {
        address: "0xener...7890",
        details: "Energy company interested in mass production licensing",
        timestamp: Math.floor(Date.now() / 1000) - 345600
      }
    ],
    accumulatedProfits: "2.2"
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
  const [estimatedPrice, setEstimatedPrice] = useState<string>('');
  const [currentNetwork, setCurrentNetwork] = useState<string>('');

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const projectData = dummyProjects[id];
        if (projectData) {
          setProject(projectData);
          if (projectData.finalized) {
            const prompt = `
              As an AI price estimation expert for ChainIP Launchpad, analyze this patent project:
              
              Project: ${projectData.projectName}
              Description: ${projectData.projectDescription}
              Current Target Price: ${projectData.targetAmount} ETH
              Current Raised: ${projectData.currentAmount} ETH
              Number of Contributors: ${projectData.contributors.length}
              Average Contribution: ${(Number(projectData.currentAmount) / Math.max(projectData.contributors.length, 1)).toFixed(2)} ETH

              Based on these factors:
              1. Project complexity and innovation level
              2. Market potential and application scope
              3. Current investor interest (number of contributors)
              4. Industry standards and comparable patents
              
              Please provide the recommended price for this project.
              Return only a number representing the ETH price, with no text or symbols.
              The max price is 0.001 ETH. Return only the number.
            `;
            const aiResult = await AIClient.send(prompt);
            setEstimatedPrice(aiResult);
          }
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        // Check if window.ethereum exists
        if (typeof window !== 'undefined' && window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          setCurrentNetwork(`${network.name} (Chain ID: ${network.chainId})`);
          console.log('Current network:', network);
        } else {
          setCurrentNetwork('No Web3 Provider detected');
        }
      } catch (error) {
        console.error('Error checking network:', error);
        setCurrentNetwork('Error detecting network');
      }
    };

    checkNetwork();
  }, []);

  const handleContribute = async () => {
    if (!contribution || loading) return;
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use a more realistic dummy address
      const userAddress = "0x6373336291468Cb9463d131aF8069a52cda3A537";
      
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
    if (!requestDetails || loading || !estimatedPrice) return;
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userAddress = "0xbd606164d19e32474ccbda3012783b218e10e52e";
      
      // Parse the estimatedPrice to ensure it's a valid number
      const parsedPrice = parseFloat(estimatedPrice.replace(/[^\d.-]/g, ''));
      
      if (isNaN(parsedPrice)) {
        throw new Error('Invalid price estimation');
      }

      // convert to wei
      const weiPrice = BigInt(parsedPrice * 10**18);
      // convert to string
      // const parsedPriceString = parsedPrice.toString();


      // connect to the contract of ProfitDistributionHook



      // Create attestation for the IP usage request
      await createNotaryAttestation(
        userAddress,
        weiPrice,
        Number(id)
      );
      
      setProject(prev => {
        if (!prev) return prev;
        
        const newAccumulatedProfits = (Number(prev.accumulatedProfits || "0") + parsedPrice).toString();
        
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
          alert(`IP request successful! Paid ${parsedPrice} ETH\n\nProfit Distribution:\n${profitMessage}`);
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
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <h2 className="text-sm text-gray-600">Creator</h2>
            <p className="font-medium">{project.creatorName}</p>
            <p className="text-blue-500">{project.twitterHandle}</p>
          </div>
          <div>
            <AiPriceEstimator 
              project={project} 
            />
          </div>
        </div>
        {/* Project Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
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
            <div className="w-full">
              <div className="text-center text-gray-600">
                {estimatedPrice ? `Current IP Request Price: ${estimatedPrice}` : 'Calculating price...'}
              </div>
            </div>
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
                disabled={!estimatedPrice || !requestDetails}
                className="w-full px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {estimatedPrice 
                  ? `Submit IP Usage Request (${estimatedPrice} )`
                  : 'Get price estimate first'
                }
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

      <div className="text-sm text-gray-600 mb-4">
        Current Network: {currentNetwork}
      </div>
    </div>
  );
}
