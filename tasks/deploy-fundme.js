const { task } = require("hardhat/config");

task("deploy-fundme", "Deploy FundMe contract").setAction(async (taskArgs, hre) => {
    //create factory 
    const fundMeFactory= await ethers.getContractFactory("FundMe")
    console.log("contract deploying")
    //deploycontract from factory
    const fundMe = await fundMeFactory.deploy()
    await fundMe.waitForDeployment()
    console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`)

    if(hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        //verify contract
        console.log("Waiting for 2 confirmations")
        await fundMe.deploymentTransaction().wait(4)
        verifyFundMe(fundMe.target)
        console.log("contract verified successfully")
    } else {
        console.log("verification skipped")
    }    
})

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

module.exports = {};