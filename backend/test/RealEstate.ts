import { expect } from 'chai'
import { ethers } from 'hardhat'
import type { RealEstate } from '../typechain-types'
import type { Escrow } from '../typechain-types'
import type { ContractTransactionResponse } from 'ethers'
import type { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'

describe('RealEstate', () => {
    let accounts: HardhatEthersSigner[]
    let seller: HardhatEthersSigner
    let realEstate: RealEstate & { deploymentTransaction(): ContractTransactionResponse } //realEstate: deployed RealEstate.sol contract
    let escrow: Escrow & { deploymentTransaction(): ContractTransactionResponse } //escrow: deployed Escrow.sol contract
    const nftID = 1

    // initialize variables before each test
    beforeEach(async () => {
        accounts = await ethers.getSigners()
        seller = accounts[0]

        //loading Contracts
        const RealEstate = await ethers.getContractFactory('RealEstate')
        const Escrow = await ethers.getContractFactory('Escrow')

        //deploying Contracts
        realEstate = await RealEstate.deploy()
        escrow = await Escrow.deploy(await realEstate.getAddress(), nftID)
    })

    describe('Deployment', async () => {
        it('Should send NFT to the seller / deployer', async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        })
    })
})
