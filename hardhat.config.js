require("@nomicfoundation/hardhat-toolbox");
// require("@chainlink/env-enc").config();
require("dotenv").config();
require("./tasks")
require("hardhat-deploy")
require("@nomicfoundation/hardhat-ethers")
require("hardhat-deploy-ethers")


const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY =process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  sourcify: { 
    enabled: true,
    //鸡巴的我试了很多次都不能验证只能sourceify，ethscan验证不了,一直显示timeout
    //服了浪费我怎么多时间,还以为是版本问题,一直在改版本,给第一个工程改烂我是真无语
    //还有鸡巴的hardhat官方更到这么新版本了,没一个比较新的教程,我得一个个看着版本慢慢下,真是烦死了
    //而且我还以为是我自己的问题,真是无语了
    //我是真的操了
  },

  defaultNetwork: "hardhat",
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  mocha: {
    timeout: 300 * 1000,
  },
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY, PRIVATE_KEY_1],
      chainId: 11155111,
    }
  },
  etherscan: {
    apiKey:{
      sepolia: ETHERSCAN_API_KEY
    }
  },
  namedAccounts: {
    firstAccount: {
      default: 0
    },
    secondAccount: {
      default: 1
    },
  },
  gasReporter: {
    enabled: false,
  },
};  
