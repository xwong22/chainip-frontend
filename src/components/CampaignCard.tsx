import { ethers } from "ethers";
import Link from 'next/link';

interface Campaign {
  id: number;
  creator: string;
  creatorName: string;
  twitterHandle: string;
  projectName: string;
  projectDescription: string;
  targetAmount: bigint;
  currentAmount: bigint;
  deadline: bigint;
  finalized: boolean;
}

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  // Convert BigInt values to strings before formatting
  const currentAmountEth = ethers.formatEther(campaign.currentAmount.toString());
  const targetAmountEth = ethers.formatEther(campaign.targetAmount.toString());
  
  const progress = (Number(currentAmountEth) / Number(targetAmountEth)) * 100;
  const daysLeft = Math.ceil((Number(campaign.deadline) * 1000 - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Link href={`/campaign/${campaign.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{campaign.projectName}</h3>
            <span className="text-sm text-blue-600">{campaign.twitterHandle}</span>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {campaign.projectDescription}
          </p>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{Number(currentAmountEth).toFixed(2)} ETH raised</span>
              <span>{Number(targetAmountEth).toFixed(2)} ETH goal</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{daysLeft}</span> days left
            </div>
            <div className="text-blue-600 text-sm font-medium">
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
