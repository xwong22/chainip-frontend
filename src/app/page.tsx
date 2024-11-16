'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import CrowdfundingABI from '../abi/Crowdfunding.json';
import { CROWDFUNDING_CONTRACT_ADDRESS } from '@/config/contracts';
import { dummyProjects } from './project/[id]/page';

interface Project {
  id: string;
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
  const [showActive, setShowActive] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [showActive]);

  const fetchProjects = async () => {
    try {
      // Filter projects based on active/successful state
      const filteredProjects = Object.entries(dummyProjects)
        .filter(([_, project]) => project.finalized !== showActive)
        .map(([id, project]) => ({
          id: id,
          creator: project.creator,
          creatorName: project.creatorName,
          twitterHandle: project.twitterHandle,
          projectName: project.projectName,
          projectDescription: project.projectDescription,
          targetAmount: project.targetAmount,
          currentAmount: project.currentAmount,
          deadline: project.deadline,
          finalized: project.finalized,
          projectImage: project.projectImage
        }));

      setProjects(filteredProjects);
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
        <div className="inline-flex rounded-lg border border-gray-200">
          <button
            onClick={() => setShowActive(true)}
            className={`px-4 py-2 text-sm font-medium ${
              showActive
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
            }`}
          >
            Active Projects
          </button>
          <button
            onClick={() => setShowActive(false)}
            className={`px-4 py-2 text-sm font-medium ${
              !showActive
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
            }`}
          >
            Successful Projects
          </button>
        </div>
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
