//imprt ethers.js
//create main function
    //init 2 accounts
    //fund 
//execute main function
const { ethers } = require("hardhat")

async function main() {
    //create factory 
    const fundMeFactory= await ethers.getContractFactory("FundMe")
    console.log("contract deploying")
    //deploycontract from factory
    const fundMe = await fundMeFactory.deploy()
    await fundMe.waitForDeployment()
    console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`)

    // if(hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    //     //verify contract
    //     // console.log("Waiting for 3 confirmations")
    //     // await fundMe.deploymentTransaction().wait(3)
    //     verifyFundMe(fundMe.target)
    // } else {
    //     console.log("verification skipped")
    // }
    await fundMe.deploymentTransaction().wait(2)

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
}  

async function verifyFundMe(fundMeAddr) {
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: [],
        verifier: 'sourcify',
        //测试能不能通过等区块而原生验证
        //不能的
        //取消这条就有问题
    });
     console.log("verify")
    //显示timeout,但是我在浏览器上显示的是验证成功了的
}

main().then().catch((error) => {
    console.error(error)
    process.exit(1)
})