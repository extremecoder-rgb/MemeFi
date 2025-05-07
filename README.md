# Sui Meme Coin DApp

A decentralized application for creating and managing meme coins on the Sui blockchain network.

## Overview

This project is a full-stack dApp that allows users to interact with a meme coin smart contract on the Sui blockchain. Users can connect their Sui wallets, mint tokens, and perform various operations with their meme coins.

## Technical Stack

### Frontend
- **Next.js 14** - React framework for production
- **TypeScript** - For type-safe code
- **Tailwind CSS** - For styling
- **@mysten/wallet-kit** - For Sui wallet integration
- **@mysten/sui.js** - Sui blockchain interaction library

### Smart Contract
- **Sui Move** - Smart contract programming language

## Features

- Wallet Connection
- Token Minting Interface
- Real-time Balance Updates
- Responsive Design

## Prerequisites

- Node.js (v18 or higher)
- Sui CLI
- A Sui Wallet (e.g., Sui Wallet Browser Extension)

## Installation

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Set up the smart contract:
```bash
cd move
sui client publish --gas-budget 100000000
```

4. Start the development server:
```bash
npm run dev
```

## Development

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build

To create a production build:

```bash
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.