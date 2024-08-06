import { expect } from 'chai'
import { ethers } from 'hardhat'
import type { Counter } from '../typechain-types'
import type { ContractTransactionResponse } from 'ethers'
import type { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'

describe('Counter', () => {
    let owner: HardhatEthersSigner //owner: Signer
    let counter: Counter & { deploymentTransaction(): ContractTransactionResponse } //counter: deployed Counter.sol contract
    let timestampBefore: number //timestamp before some action (the actions is timestampBefore + 1)

    // initialize variables before each test
    beforeEach(async () => {
        owner = (await ethers.getSigners())[0]
        // load Counter contract and deploy it
        const Counter = await ethers.getContractFactory('Counter')
        counter = await Counter.deploy('My Counter', 1)
        // get the timestamp before the tests (and after all initializations)
        const blockNumBefore = await ethers.provider.getBlockNumber()
        const blockBefore = await ethers.provider.getBlock(blockNumBefore)
        timestampBefore = blockBefore!.timestamp
    })

    // initialize the contract test
    describe('Initialization and getters', () => {
        it('Should get the initial count', async () => {
            expect(await counter.getCount()).to.equal(1)
        })

        it('Should get the initial name', async () => {
            expect(await counter.getName()).to.equal('My Counter')
        })
    })

    // setters test
    describe('Setters', () => {
        let transaction: ContractTransactionResponse
        it('Should set a new name', async () => {
            transaction = await counter.setName('New Counter')
            await transaction.wait()
            await expect(transaction)
                .to.emit(counter, 'NameModified')
                .withArgs(timestampBefore + 1, owner.address, 'My Counter', 'New Counter')

            expect(await counter.getName()).to.equal('New Counter')
        })
    })

    // countings test
    describe('Counting', () => {
        let transaction: ContractTransactionResponse
        it('Should increment the count', async () => {
            transaction = await counter.increment()
            await transaction.wait()
            await expect(transaction)
                .to.emit(counter, 'Increment')
                .withArgs(timestampBefore + 1, owner.address, 1, 2)
        })

        it('Should decrement the count', async () => {
            transaction = await counter.decrement()
            await transaction.wait()
            await expect(transaction)
                .to.emit(counter, 'Decrement')
                .withArgs(timestampBefore + 1, owner.address, 1, 0)

            await expect(counter.decrement()).to.be.reverted
        })
    })
})
