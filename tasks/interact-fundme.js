// const {ethers} = require("hardhat")
const { task } = require('hardhat/config'); 

task('interact-fundme', 'Interact with FundMe contract')
   .addParam("addr", "fundme contract address")
   .setAction(async(taskArgs, hre) => {
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        const fundMe = fundMeFactory.attach(taskArgs.addr)
        // await fundMe.deploymentTransaction().wait(2)
        const [firstAccount, secondAccount] = await ethers.getSigners()

        const fundTx =await fundMe.fund({value: 1})
        await fundTx.wait()

        const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
        console.log(`balance of contract is ${balanceOfContract}`)

        const fundTxWithSecondAccount =await fundMe.connect(secondAccount).fund({value: 1})
        await fundTxWithSecondAccount.wait()

        const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target)
        console.log(`balance of contract is ${balanceOfContractAfterSecondFund}`)

        const firstAccountbalanceInFundMe = await fundMe.funderToAmount(firstAccount.address)
        const secondAccountbalanceInFundMe = await fundMe.funderToAmount(secondAccount.address)
        console.log(`balance of first account ${firstAccount.address} in fundMe is ${firstAccountbalanceInFundMe}`)
        console.log(`balance of second account ${secondAccount.address} in fundMe is ${secondAccountbalanceInFundMe}`)    
})

module.exports = {}