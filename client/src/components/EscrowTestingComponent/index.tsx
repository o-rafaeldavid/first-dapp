import {
    useWeb3ModalProvider,
    useWeb3ModalAccount
} from '@web3modal/ethers/react'
import { BrowserProvider, Contract, formatUnits } from 'ethers'
import { ESCROW_CONTRACT_ADDRESS } from '../../utils/constants'
import escrow_abi from '../../utils/abis/Escrow_ABI.json'

const EscrowTestingComponent = () => {
    const { isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    async function getBalance() {
        if (!walletProvider) throw Error('Wallet provider not found')
        if (!isConnected) throw Error('User disconnected')

        const ethersProvider = new BrowserProvider(walletProvider)
        const signer = await ethersProvider.getSigner()
        // The Contract object
        const EscrowContract = new Contract(
            ESCROW_CONTRACT_ADDRESS,
            escrow_abi,
            signer
        )
        const EscrowBalance = await EscrowContract.getBalance()

        console.log(formatUnits(EscrowBalance, 18))
    }

    return <button onClick={getBalance}>Get Escrow Contract Balance</button>
}

export default EscrowTestingComponent
