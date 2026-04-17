const { DECIMAL, INITIAl_ANSWER, developmentChains } = require("../helper-hardhatconfig")


module.exports = async ({getNamedAccounts, deployments}) => {
    if (developmentChains.includes(network.name)) {
        const {firstAccount} = await getNamedAccounts()
        const {deploy} =  await deployments

        await deploy("MockV3Aggregator",{
            from: firstAccount,
            args: [DECIMAL, INITIAl_ANSWER],
            log: true
        })
    } else {
        console.log("environment is not local, mock deployment is skipped")
    }
    
}

module.exports.tags = ["all", "mock"]