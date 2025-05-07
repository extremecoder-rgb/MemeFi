import Image from "next/image";

'use client';

import { WalletKitProvider } from '@mysten/wallet-kit';
import WalletConnection from '@/components/WalletConnection';
import MintingInterface from '@/components/MintingInterface';

export default function Home() {
  return (
    <WalletKitProvider>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <WalletConnection />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Sui Meme Coin Minter
          </h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Welcome to the Meme Coin Minter! Connect your wallet and start minting your own Meme Coins on the Sui network.
          </p>
          <MintingInterface />
        </div>
      </main>
    </WalletKitProvider>
  );
}
