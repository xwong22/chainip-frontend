'use client'

import Link from 'next/link';
// import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
// import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

import {
    DynamicContextProvider,
    DynamicWidget,
  } from "@dynamic-labs/sdk-react-core";
  
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

export default function Header() {
//   const { primaryWallet, user } = useDynamicContext();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            ChainIP Crowdfunding
          </h1>
          <div className="flex items-center gap-4">
            <Link 
            href="/create-campaign"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
            Create Campaign
            </Link>
            {/* <DynamicWidget /> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
