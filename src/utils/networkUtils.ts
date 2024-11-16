export const SUPPORTED_NETWORKS = {
    SCROLL_SEPOLIA: {
      chainId: '0x8274f',
      chainName: 'Scroll Sepolia',
      rpcUrls: ['https://sepolia-rpc.scroll.io'],
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18
      },
      blockExplorerUrls: ['https://sepolia.scrollscan.dev']
    }
  };
  
  export const switchNetwork = async () => {
    if (!window.ethereum) throw new Error("No Web3 Provider found");
    
    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SUPPORTED_NETWORKS.SCROLL_SEPOLIA.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SUPPORTED_NETWORKS.SCROLL_SEPOLIA],
          });
        } catch (addError) {
          throw new Error("Failed to add network");
        }
      } else {
        throw switchError;
      }
    }
  };
  
  export const checkAndSwitchNetwork = async () => {
    if (!window.ethereum) throw new Error("No Web3 Provider found");
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    
    if (network.chainId.toString() !== SUPPORTED_NETWORKS.SCROLL_SEPOLIA.chainId) {
      await switchNetwork();
    }
    
    return network;
  };