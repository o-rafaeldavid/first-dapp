import {
    useWeb3ModalProvider,
    useWeb3ModalAccount
} from '@web3modal/ethers/react'
import { BrowserProvider, formatUnits } from 'ethers'

import { Escrow_ABI__factory } from '../../typescript/contracts'
import { Console } from '../../utils/console'
import { ESCROW_CONTRACT_ADDRESS } from '../../utils/contracts/addrs'

const EscrowTestingComponent = () => {
    const { isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    async function getBalance() {
        if (!walletProvider) throw Error('Wallet provider not found')
        if (!isConnected) throw Error('User disconnected')

        const ethersProvider = new BrowserProvider(walletProvider)
        const signer = await ethersProvider.getSigner()
        // The Contract object
        const EscrowContract = Escrow_ABI__factory.connect(
            ESCROW_CONTRACT_ADDRESS,
            signer
        )
        const EscrowBalance = await EscrowContract.getBalance()

        Console.log!(formatUnits(EscrowBalance, 18))
    }

    return <button onClick={getBalance}>Get Escrow Contract Balance</button>
}

export default EscrowTestingComponent
