import { expect } from 'chai'
import { ethers } from 'hardhat'
import type { RealEstate } from '../typechain-types'
import type { Escrow } from '../typechain-types'
import type { ContractTransactionResponse, TransactionReceipt } from 'ethers'
import type { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'

const ether = (n: number) => ethers.parseEther(n.toString())

describe('RealEstate', () => {
    let transaction: ContractTransactionResponse
    let receipt: TransactionReceipt | null
    let timestampBefore: number
    //
    let owner: HardhatEthersSigner
    let seller: HardhatEthersSigner
    let buyer: HardhatEthersSigner
    let inspector: HardhatEthersSigner
    let lender: HardhatEthersSigner
    //
    let purchasePrice = ether(100)
    let escrowAmount = ether(20)
    //
    let realEstate: RealEstate & { deploymentTransaction(): ContractTransactionResponse } //realEstate: deployed RealEstate.sol contract
    let escrow: Escrow & { deploymentTransaction(): ContractTransactionResponse } //escrow: deployed Escrow.sol contract
    //
    let NFT: { id: number; address: string } = {
        id: -1,
        contractAddress: '',
    }

    // initialize variables before each test
    beforeEach(async () => {
        ;[owner, seller, buyer, inspector, lender] = await ethers.getSigners()
        // loading Contracts
        const RealEstate = await ethers.getContractFactory('RealEstate')
        const Escrow = await ethers.getContractFactory('Escrow')

        // Deploying Contracts
        // RealEstate NFT
        realEstate = await RealEstate.deploy(owner.address)
        transaction = await realEstate.safeMint(
            seller.address,
            'https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/1.json',
        )
        receipt = await transaction.wait()
        if (receipt === null) throw new Error('NFT Mint TX failed!')

        // get Transfer event Log
        const transferEventParsedLog = realEstate.interface.parseLog(
            receipt.logs.find((log) => realEstate.interface.parseLog(log)?.name === 'Transfer')!,
        )

        if (transferEventParsedLog) NFT.id = Number(transferEventParsedLog.args.tokenId)
        else throw new Error('Transfer event not found')

        NFT.contractAddress = await realEstate.getAddress()

        // Escrow
        escrow = await Escrow.deploy(
            NFT.contractAddress,
            NFT.id,
            seller.address,
            buyer.address,
            inspector.address,
            lender.address,
        )

        // seller approves NFT to be sold
        transaction = await realEstate.connect(seller).approve(await escrow.getAddress(), NFT.id)
        await transaction.wait()

        // get the timestamp before the tests (and after all initializations)
        const blockNumBefore = await ethers.provider.getBlockNumber()
        const blockBefore = await ethers.provider.getBlock(blockNumBefore)
        timestampBefore = blockBefore!.timestamp
    })

    describe('Deployment', async () => {
        it('Should verify the NFT owner (seller)', async () => {
            expect(await realEstate.ownerOf(NFT.id)).to.equal(seller.address)
        })
    })

    /* describe('Listing', async () => {
        it('Update the ownership', async () => {
            expect(await realEstate.ownerOf(NFT.id)).to.equal(await escrow.getAddress())
        })
    }) */

    describe('Selling Real Estate', async () => {
        it('Should execute a successful transaction', async () => {
            let transactionCounter = 0
            //checks balance before the transaction
            let balance = await ethers.provider.getBalance(seller.address)
            console.log('       💰 Seller Balance: ', ethers.formatEther(balance))
            // Expects the seller to be the NFT owner before the sell (transaction)
            expect(await realEstate.ownerOf(NFT.id)).to.equal(seller.address)
            console.log('       ✅ Seller is the NFT owner')

            // Expects the seller to list the NFT for sale
            transaction = await realEstate.connect(seller).approve(await escrow.getAddress(), NFT.id)
            await transaction.wait()
            transactionCounter++

            transaction = await escrow.connect(seller).list(NFT.id, purchasePrice, escrowAmount)
            await transaction.wait()
            transactionCounter++

            expect(await realEstate.ownerOf(NFT.id)).to.equal(await escrow.getAddress())
            expect(transaction)
                .to.emit(escrow, 'ListEvent')
                .withArgs(
                    timestampBefore + transactionCounter,
                    NFT.address,
                    NFT.id,
                    seller,
                    buyer,
                    purchasePrice,
                    escrowAmount,
                )

            const result = await escrow.isListed(NFT.id)
            expect(result).to.equal(true)

            console.log('       ✅ Seller listed NFT to the Escrow contract')

            // Buyer deposits earnest (escrow amount)
            transaction = await escrow.connect(buyer).depositEarnest({ value: escrowAmount })
            await transaction.wait()
            transactionCounter++
            console.log('       ✅ Buyer deposited earnest')

            // Just to check the escrow balance
            balance = await escrow.getBalance()
            console.log('       💰 Escrow Balance: ', ethers.formatEther(balance))

            // Inspector updates the status of the inspection
            transaction = await escrow.connect(inspector).updateInspectionStatus(true)
            await transaction.wait()
            transactionCounter++
            await expect(transaction)
                .to.emit(escrow, 'InspectionEvent')
                .withArgs(timestampBefore + transactionCounter, NFT.address, NFT.id, inspector, true)
            console.log('       ✅ Inspection set to true')

            // Lender sends the loan amount to the escrow
            await lender.sendTransaction({ to: await escrow.getAddress(), value: purchasePrice - escrowAmount })
            transactionCounter++

            // Approving Sale from buyer, seller, and lender
            const approvals = [buyer, seller, lender]
            for (const approval of approvals) {
                const transaction = await escrow.connect(approval).approveSale()
                await transaction.wait()
                transactionCounter++
                await expect(transaction)
                    .to.emit(escrow, 'ApprovedSaleByEvent')
                    .withArgs(timestampBefore + transactionCounter, NFT.address, NFT.id, approval)
                console.log('       ✅ Approved Sale by: ', approval.address)
            }

            // Expects the sell to be successful
            transaction = await escrow.connect(buyer).transactionSale()
            await transaction.wait()
            transactionCounter++
            await expect(transaction)
                .to.emit(escrow, 'SaleEvent')
                .withArgs(timestampBefore + transactionCounter, NFT.address, NFT.id, seller, buyer)
            console.log('       🤑 Transaction done successfully')

            // Expects the buyer to be the NFT owner after the sell
            expect(await realEstate.ownerOf(NFT.id)).to.equal(buyer.address)

            //checks balance after the transaction
            balance = await ethers.provider.getBalance(seller.address)
            console.log('       💰 Seller Balance: ', ethers.formatEther(balance))
            expect(balance).to.above(10099)
        })
    })
})
