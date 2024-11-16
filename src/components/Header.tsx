'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import AiSearchBar from './AiSearchBar';

export default function Header() {
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      setAddress(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!mounted) return null;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            ChainIP Launchpad
          </Link>
          <div className="flex items-center gap-4">
            <AiSearchBar />
            <Link 
              href="/successful-projects"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Successful Projects
            </Link>
            <Link 
              href="/create-project"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create Project
            </Link>
            {isConnected ? (
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-mono">{formatAddress(address)}</span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
