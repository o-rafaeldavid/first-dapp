import type { EthereumProvider } from '@metamask/providers'

declare global {
    interface Window {
        ethereum?: EthereumProvider
    }
}
