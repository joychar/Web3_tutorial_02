const DECIMAL = 8
const INITIAl_ANSWER = 3000 * 10 ** DECIMAL
const developmentChains = ["hardhat", "local"]
const CONFIRMATIONS = 0
const networkConfig = {
    11155111: {
        ethUsdDataFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    },
}

module.exports = {
    DECIMAL,
    INITIAl_ANSWER,
    developmentChains,
    networkConfig,
    CONFIRMATIONS,
}