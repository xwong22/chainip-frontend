import { useState } from "react";
import { ethers } from "ethers";

const CampaignForm = ({ contract, fetchCampaigns }: any) => {
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    try {
      const tx = await contract.initializeCampaign(
        ethers.parseEther(targetAmount),
        Math.floor(new Date(deadline).getTime() / 1000)
      );
      await tx.wait();
      fetchCampaigns();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Start a New Campaign</h2>
      <input
        type="text"
        placeholder="Target Amount (ETH)"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
      />
      <input
        type="datetime-local"
        placeholder="Deadline"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button type="submit">Start Campaign</button>
    </form>
  );
};

export default CampaignForm;
