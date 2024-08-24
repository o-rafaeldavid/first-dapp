import { ContractTransactionResponse } from 'ethers'
import hre, { ethers } from 'hardhat'

const ether = (n: number) => ethers.parseEther(n.toString())

async function main() {
    let transaction: ContractTransactionResponse
    console.log('\n'.repeat(100))
    console.log('Creating sIgners...\n')
    const [owner, seller, buyer, inspector, lender] = await ethers.getSigners()

    console.log("Owner's address:\n", owner.address, '\n')
    console.log("Seller's address:\n", seller.address, '\n')
    console.log("Buyer's address:\n", buyer.address, '\n')
    console.log("Inspector's address:\n", inspector.address, '\n')
    console.log("Lender's address:\n", lender.address, '\n')

    console.log('='.repeat(100) + '\n\n\n')

    // Deploy Real Estate Contract
    console.log(`Deploying Real Estate Contract...`)
    const RealEstate = await ethers.getContractFactory('RealEstate')
    const realEstate = await RealEstate.deploy(owner.address)
    const realEstateAddress = await realEstate.getAddress()

    console.log(`Deployed Real Estate Contract at: ${realEstateAddress}`)
    console.log(`Minting 3 properties...\n`)

    for (let i = 0; i < 3; i++) {
        transaction = await realEstate.safeMint(
            seller.address,
            `https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${i + 1}.json`,
        )
        await transaction.wait()
    }

    console.log(`Minted 3 properties by seller from owner\n`)
    console.log('='.repeat(100) + '\n\n\n')

    // Deploy Escrow Contract
    console.log(`Deploying Escrow Contract...`)

    console.log(`Deployed Escrow Contract at: ${escrowAddress}`)
    console.log(`Listing 3 properties...\n`)

    for (let i = 0; i < 3; i++) {
        const Escrow = await ethers.getContractFactory('Escrow')
        const escrow = await Escrow.deploy(realEstateAddress)
        const escrowAddress = await escrow.getAddress()
        let transaction = await realEstate.connect(seller).approve(escrowAddress, i)
        await transaction.wait()
    }

    console.log(`Approved 3 properties by seller for escrow\n`)

    console.log(`Listing 3 properties by seller for escrow...\n`)

    for (let i = 0; i < 3; i++) {
        const purchasePrice = Math.floor(Math.random() * 21) + 10 // integer between 10 and 30
        const minEscrowPercent = 0.02 // 2%
        const maxEscrowPercent = 0.16 // 16%
        const escrowAmount = Math.floor(
            Math.random() * (maxEscrowPercent - minEscrowPercent) * purchasePrice + minEscrowPercent * purchasePrice,
        ) // integer between 2% and 16% of purchasePrice
        transaction = await escrow.connect(seller).list(i, purchasePrice, escrowAmount)
        await transaction.wait()
    }

    console.log(`Listed 3 properties by seller for escrow\n`)

    console.log(`Finished.`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
