'use client';

import { useState, useCallback } from 'react';
import { CONFIG } from '../config/contract';
import { useWalletKit } from '@mysten/wallet-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SUI_DECIMALS } from '@mysten/sui.js/utils';

const MEME_DECIMALS = 9;
const MAX_MINT_AMOUNT = BigInt(1000000000000); 

export default function MintingInterface() {
  const { currentAccount, signAndExecuteTransactionBlock } = useWalletKit();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');

  const validateAmount = useCallback((value: string): bigint | null => {
    try {
      const parsedAmount = BigInt(value.trim());
      if (parsedAmount <= 0n) {
        throw new Error('Amount must be greater than 0');
      }
      if (parsedAmount > MAX_MINT_AMOUNT) {
        throw new Error('Amount exceeds maximum allowed');
      }
      return parsedAmount;
    } catch (err) {
      return null;
    }
  }, []);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount || !currentAccount.address) {
      setError('Wallet not connected or invalid wallet state');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      setTransactionStatus('Preparing transaction...');

      const parsedAmount = validateAmount(amount);
      if (!parsedAmount) {
        throw new Error('Invalid amount. Please enter a valid positive number');
      }

      const txb = new TransactionBlock();
      const baseGas = 2000000;
      const gasPerToken = 1000;
      const estimatedGas = baseGas + Number(parsedAmount) * gasPerToken;
      txb.setGasBudget(Math.min(estimatedGas, 10000000));

      setTransactionStatus('Building transaction...');
      
      txb.moveCall({
        target: `${CONFIG.PACKAGE_ID}::${CONFIG.MODULE_NAME}::mint`,
        arguments: [
          txb.object(CONFIG.TREASURY_CAP_ID),          
          txb.pure(parsedAmount, 'u64'),
          txb.pure(currentAccount.address, 'address'),
        ]
      });
      

      setTransactionStatus('Awaiting wallet approval...');
      
      const response = await signAndExecuteTransactionBlock({
        transactionBlock: txb,
        options: {
          showEffects: true,
          showEvents: true,
          showInput: true
        }
      });

      if (!response || !response.effects) {
        throw new Error('Invalid transaction response');
      }

      if (response.effects.status?.status === 'success') {
        const formattedAmount = Number(parsedAmount) / Math.pow(10, MEME_DECIMALS);
        setSuccess(
          `Successfully minted ${formattedAmount.toLocaleString()} MEME coins!\nTransaction: ${response.digest}`
        );
        setAmount('');
      } else {
        const errorMessage = response.effects.status?.error || 'Unknown error';
        throw new Error('Transaction failed: ' + errorMessage);
      }
    } catch (err) {
      console.error('Minting error:', err);
      const errMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to mint coins: ${errMsg}`);
    } finally {
      setIsLoading(false);
      setTransactionStatus('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Mint MEME Coins</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">Mint MEME coins using treasury cap</p>
      
      {currentAccount && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg break-all">
          <p className="text-sm font-medium text-gray-700">Connected Wallet:</p>
          <p className="text-gray-600 mt-1 text-sm">{currentAccount.address}</p>
        </div>
      )}
      
      <form onSubmit={handleMint} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Mint
          </label>
          <div className="relative">
            <input
              id="amount"
              type="text"
              pattern="[0-9]*"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount (e.g., 1000)"
              required
              disabled={isLoading}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Maximum mint amount: {(Number(MAX_MINT_AMOUNT) / Math.pow(10, MEME_DECIMALS)).toLocaleString()} MEME
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !currentAccount}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors duration-200 ${
            isLoading || !currentAccount
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Processing...' : 'Mint Coins'}
        </button>

        {transactionStatus && (
          <div className="p-3 text-sm text-blue-700 bg-blue-50 rounded-lg">
            {transactionStatus}
          </div>
        )}

        {error && (
          <div className="p-4 text-sm text-red-500 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 text-sm text-green-500 bg-green-50 rounded-lg whitespace-pre-wrap">
            {success}
          </div>
        )}

        {!currentAccount && (
          <div className="text-center text-sm text-gray-500">
            Please connect your wallet to mint coins
          </div>
        )}
      </form>
    </div>
  );
}
