'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import { CROWDFUNDING_CONTRACT_ADDRESS } from '@/config/contracts';
import CrowdfundingABI from '@/abi/Crowdfunding.json';
import { dummyProjects } from '../project/[id]/page';

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

  useEffect(() => {
    // Filter only completed projects from dummyProjects
    const successfulProjects = Object.values(dummyProjects)
      .filter(project => project.finalized)
      .map(project => ({
        id: project.id,
        projectName: project.projectName,
        creatorName: project.creatorName,
        targetAmount: project.targetAmount,
        currentAmount: project.currentAmount,
        deadline: project.deadline,
        finalized: project.finalized,
        projectImage: project.projectImage,
        projectDescription: project.projectDescription
      }));

    setProjects(successfulProjects);
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