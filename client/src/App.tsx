import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

import type { Chain, Metadata } from '@web3modal/scaffold-utils/ethers'

import ConnectWallet from './components/ConnectWallet'
import EscrowTestingComponent from './components/EscrowTestingComponent'

// 1. Get projectId
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

// 2. Set chains
const localTestnet: Chain = {
    chainId: import.meta.env.VITE_LOCAL_TESTNET_ID,
    name: import.meta.env.VITE_LOCAL_TESTNET_NAME,
    currency: 'ETH',
    explorerUrl: '',
    rpcUrl: import.meta.env.VITE_LOCAL_TESTNET_URL
}

// 3. Create a metadata object
const metadata: Metadata = {
    name: 'My Website',
    description: 'My Website description',
    url: import.meta.env.VITE_LOCALHOST_URL, // origin must match your domain & subdomain
    icons: []
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
    /*Required*/
    metadata,

    /*Optional*/
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default
    enableCoinbase: false, // true by default
    rpcUrl: '...', // used for the Coinbase SDK
    defaultChainId: 1 // used for the Coinbase SDK
})

// 5. Create a AppKit instance
createWeb3Modal({
    ethersConfig,
    chains: [localTestnet],
    projectId,
    enableAnalytics: true // Optional - defaults to your Cloud configuration
})

const App = () => {
    return (
        <>
            <ConnectWallet />
            <EscrowTestingComponent />
        </>
    )
}

export default App
