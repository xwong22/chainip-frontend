'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import { CROWDFUNDING_CONTRACT_ADDRESS } from '@/config/contracts';
import CrowdfundingABI from '@/abi/Crowdfunding.json';

interface Project {
  id: string;
  projectName: string;
  creatorName: string;
  targetAmount: string;
  currentAmount: string;
  deadline: number;
  finalized: boolean;
  projectImage: string;
  projectDescription: string;
}

export default function SuccessfulProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Using dummy data with images
  useEffect(() => {
    setProjects([
      {
        id: "1",
        projectName: "Decentralized Patent System",
        creatorName: "Alice Johnson",
        targetAmount: "5.0",
        currentAmount: "5.2",
        deadline: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
        finalized: true,
        projectImage: "https://picsum.photos/800/400?random=1",
        projectDescription: "A revolutionary system for managing and trading intellectual property rights using blockchain technology."
      },
      {
        id: "2",
        projectName: "IP Rights Management Platform",
        creatorName: "Bob Smith",
        targetAmount: "3.0",
        currentAmount: "3.5",
        deadline: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
        finalized: true,
        projectImage: "https://picsum.photos/800/400?random=2",
        projectDescription: "Streamlined platform for managing intellectual property rights and licenses across multiple jurisdictions."
      },
      {
        id: "3",
        projectName: "Smart Contract Patent System",
        creatorName: "Charlie Brown",
        targetAmount: "7.0",
        currentAmount: "8.1",
        deadline: Math.floor(Date.now() / 1000) - 259200, // 3 days ago
        finalized: true,
        projectImage: "https://picsum.photos/800/400?random=3",
        projectDescription: "Automated patent filing and management system powered by smart contracts."
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) return <div className="max-w-6xl mx-auto p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-4">
      <h1 className="text-xl font-bold mb-6">Successful Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link href={`/project/${project.id}`} key={project.id}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Image Section */}
              <div className="h-48 w-full">
                <img 
                  src={project.projectImage} 
                  alt={project.projectName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{project.projectName}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.projectDescription}</p>
                <p className="text-gray-600 mb-4">by {project.creatorName}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-medium">{project.targetAmount} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Raised:</span>
                    <span className="font-medium">{project.currentAmount} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium">
                      {new Date(project.deadline * 1000).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${Math.min(
                          (Number(project.currentAmount) / Number(project.targetAmount)) * 100, 
                          100
                        )}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Successfully Funded
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No successful projects found</p>
      )}
    </div>
  );
}