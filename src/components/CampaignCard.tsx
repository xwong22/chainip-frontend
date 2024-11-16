import { useState } from "react";
import { ethers } from "ethers";

const CampaignCard = ({ campaign }: any) => {
  const [amount, setAmount] = useState("");

  const contribute = async () => {
    try {
      const tx = await campaign.contract.contribute(campaign.id, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      alert("Contribution successful!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Campaign #{campaign.id}</h3>
      <p>Creator: {campaign.creator}</p>
      <p>Target: {ethers.parseEther(campaign.targetAmount)} ETH</p>
      <p>Current: {ethers.parseEther(campaign.currentAmount)} ETH</p>
      <p>Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}</p>
      <p>Finalized: {campaign.finalized ? "Yes" : "No"}</p>
      <input
        type="text"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={contribute}>Contribute</button>
    </div>
  );
};

export default CampaignCard;
