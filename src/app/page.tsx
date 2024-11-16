'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import CrowdfundingABI from '../abi/Crowdfunding.json';
import { CROWDFUNDING_CONTRACT_ADDRESS } from '@/config/contracts';

interface Project {
  id: number;
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
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Temporary: Use dummy data instead of contract calls
      const dummyProjects: Project[] = [
        {
          id: 1,
          creator: "0x1234567890123456789012345678901234567890",
          creatorName: "Alice Johnson",
          twitterHandle: "@alice_web3",
          projectName: "DeFi Education Platform",
          projectDescription: "Building an interactive platform to teach DeFi concepts to beginners through gamification and hands-on exercises.",
          targetAmount: "10.0",
          currentAmount: "6.5",
          deadline: Math.floor(Date.now() / 1000) + 864000, // 10 days from now
          finalized: false,
          projectImage: "https://picsum.photos/800/400"
        },
        {
          id: 2,
          creator: "0x2345678901234567890123456789012345678901",
          creatorName: "Bob Smith",
          twitterHandle: "@bob_builds",
          projectName: "NFT Marketplace",
          projectDescription: "Creating a carbon-neutral NFT marketplace focused on environmental sustainability and green initiatives.",
          targetAmount: "15.0",
          currentAmount: "3.0",
          deadline: Math.floor(Date.now() / 1000) + 1728000, // 20 days from now
          finalized: false,
          projectImage: "https://picsum.photos/800/400"
        },
        {
          id: 3,
          creator: "0x3456789012345678901234567890123456789012",
          creatorName: "Carol White",
          twitterHandle: "@carol_crypto",
          projectName: "DAO Governance Tool",
          projectDescription: "Developing a user-friendly interface for DAO governance with integrated voting and proposal management.",
          targetAmount: "8.0",
          currentAmount: "7.9",
          deadline: Math.floor(Date.now() / 1000) + 432000, // 5 days from now
          finalized: false,
          projectImage: "https://picsum.photos/800/400"
        }
      ];

      setProjects(dummyProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading projects...</p>
      </div>
    );
  }

  return (
    <main className="container max-w-6xl mx-auto px-6 py-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">Active Projects</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link href={`/project/${project.id}`} key={project.id}>
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {project.projectImage && (
                <div className="h-48 w-full">
                  <img 
                    src={project.projectImage} 
                    alt={project.projectName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{project.projectName}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.projectDescription}</p>
                <div className="space-y-2">
                  <p>Creator: {project.creatorName}</p>
                  <p>Target: {project.targetAmount} ETH</p>
                  <p>Raised: {project.currentAmount} ETH</p>
                  <p>Deadline: {new Date(project.deadline * 1000).toLocaleDateString()}</p>
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
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No active projects found</p>
      )}
    </main>
  );
}
