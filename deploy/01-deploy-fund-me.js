// function deployFunction() {
//     console.log("this is a deploy function")
// }

const { network } = require("hardhat")
const { developmentChains, networkConfig, CONFIRMATIONS } = require("../helper-hardhatconfig")

// module.exports.default =  deployFunction

// module.exports = async (hre) => {
//     const getNamedAccounts = hre.getNamedAccounts
//     const deployments = hre.deployments
// }s

module.exports = async ({getNamedAccounts, deployments}) => {
    const {firstAccount} = (await getNamedAccounts())
    const {deploy} = deployments

    let dataFeedAddr
    if(developmentChains.includes(network.name)) {
        const mockDataFeed =  await deployments.get("MockV3Aggregator")
        dataFeedAddr = mockDataFeed.address
    } else {
        const networkDataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
        dataFeedAddr = networkDataFeedAddr
    }
    const fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [dataFeedAddr],
        log: true,
        waitConfirmations: CONFIRMATIONS,
    })

    if(hre.network.config.chainId == 11155111 && process.env.ETHERSACN_API_KEY) {
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [dataFeedAddr],
        })
    } else {
        console.log("NetWork is not sepolia, verification skippeed...")
    }
}

module.exports.tags = ["all", "fundme"]