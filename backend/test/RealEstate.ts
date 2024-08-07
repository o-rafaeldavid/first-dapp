import { expect } from 'chai'
import { ethers } from 'hardhat'
import type { RealEstate } from '../typechain-types'
import type { Escrow } from '../typechain-types'
import type { ContractTransactionResponse } from 'ethers'
import type { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'

const ether = (n: number) => ethers.parseEther(n.toString())

describe('RealEstate', () => {
    let transaction: ContractTransactionResponse
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
        id: 1,
        address: '',
    }

    // initialize variables before each test
    beforeEach(async () => {
        ;[owner, seller, buyer, inspector, lender] = await ethers.getSigners()
        // loading Contracts
        const RealEstate = await ethers.getContractFactory('RealEstate')
        const Escrow = await ethers.getContractFactory('Escrow')

        // deploying Contracts
        realEstate = await RealEstate.deploy(owner.address)
        NFT.address = await realEstate.getAddress()
        escrow = await Escrow.deploy(
            NFT.address,
            NFT.id,
            purchasePrice,
            escrowAmount,
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
        it('Should send NFT to the seller / deployer / owner', async () => {
            expect(await realEstate.ownerOf(NFT.id)).to.equal(seller.address)
        })
    })

    describe('Selling Real Estate', async () => {
        it('Should execute a successful transaction', async () => {
            let transactionCounter = 0
            // Expects the seller to be the NFT owner before the sell (transaction)
            expect(await realEstate.ownerOf(NFT.id)).to.equal(seller.address)

            // Buyer deposits earnest (escrow amount)
            transaction = await escrow.connect(buyer).depositEarnest({ value: escrowAmount })
            await transaction.wait()
            transactionCounter++
            console.log('Buyer deposited earnest')

            // Just to check the escrow balance
            let balance = await escrow.getBalance()
            console.log('Escrow Balance: ', ethers.formatEther(balance))

            // Inspector updates the status of the inspection
            transaction = await escrow.connect(inspector).updateInspectionStatus(true)
            await transaction.wait()
            transactionCounter++
            await expect(transaction)
                .to.emit(escrow, 'InspectionEvent')
                .withArgs(timestampBefore + transactionCounter, NFT.address, NFT.id, inspector, true)
            console.log('Inspection set to true')

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
                console.log('Approved Sale by: ', approval.address)
            }

            // Expects the sell to be successful
            transaction = await escrow.connect(buyer).transactionSale()
            await transaction.wait()
            transactionCounter++
            await expect(transaction)
                .to.emit(escrow, 'SaleEvent')
                .withArgs(timestampBefore + transactionCounter, NFT.address, NFT.id, seller, buyer)
            console.log('Transaction done successfully')

            // Expects the buyer to be the NFT owner after the sell
            expect(await realEstate.ownerOf(NFT.id)).to.equal(buyer.address)

            //checks balance after the transaction
            balance = await ethers.provider.getBalance(seller.address)
            console.log('Seller Balance: ', ethers.formatEther(balance))
            expect(await realEstate.ownerOf(NFT.id)).to.above(10099)
        })
    })
})
