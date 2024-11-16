import { useEffect } from 'react';
import { ethers } from 'ethers';

interface ContractListenerProps {
  contractAddress: string;
  contractABI: any[];
}

const ContractListener: React.FC<ContractListenerProps> = ({ contractAddress, contractABI }) => {
  useEffect(() => {
    const setupListener = async () => {
      if (typeof window.ethereum !== 'undefined') {
        // Initialize provider using window.ethereum (MetaMask or other provider)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Listen for the "HolderAdded" event
        contract.on('HolderAdded', (account: string) => {
          console.log('New holder added:', account);
        });
      } else {
        console.error('Ethereum provider (MetaMask) is not available');
      }
    };

    setupListener();

    // Clean up the event listener when the component unmounts
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        contract.off('HolderAdded');
      }
    };
  }, [contractAddress, contractABI]);

  return <div>Listening for new holders...</div>;
};

export default ContractListener;
