'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/navigation'
import CrowdfundingABI from '@/abi/Crowdfunding.json'
import { parseEther } from 'ethers'
import { CROWDFUNDING_CONTRACT_ADDRESS } from '@/config/contracts'

export default function CreateProject() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    creatorName: '',
    twitterHandle: '',
    projectName: '',
    projectDescription: '',
    targetAmount: '',
    deadline: '',
    projectImage: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate contract interaction delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simulate successful campaign creation
      const mockCampaignId = Math.floor(Math.random() * 1000) // Generate random ID for development
      
      alert('Campaign created successfully!')
      
      // Reset form
      setFormData({
        creatorName: '',
        twitterHandle: '',
        projectName: '',
        projectDescription: '',
        targetAmount: '',
        deadline: '',
        projectImage: ''
      })
      setImagePreview(null)

      // Navigate to the campaign detail page
      router.push(`/campaign/${mockCampaignId}`)

    } catch (error) {
      console.error('Error creating campaign:', error)
      alert('Error creating campaign. Check console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData(prev => ({
        ...prev,
        projectImage: imageUrl
      }));
    }
  };

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Creator Name</label>
            <input
              type="text"
              name="creatorName"
              value={formData.creatorName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Twitter Handle</label>
            <input
              type="text"
              name="twitterHandle"
              value={formData.twitterHandle}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Project Name</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Project Description</label>
            <textarea
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>

          <div>
            <label className="block mb-1">Target Amount (ETH)</label>
            <input
              type="number"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Deadline</label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Project Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
            />
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Project preview" 
                  className="w-full max-h-48 object-cover rounded"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
    </main>
  )
}
