'use client';

import { ConnectButton } from '@mysten/wallet-kit';

export default function WalletConnection() {
  return (
    <div className="flex justify-end p-4">
      <ConnectButton className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200" />
    </div>
  );
}