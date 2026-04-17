# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

当需要在本地测试读取调用链上合约时,可以使用模拟合约及mock合约

hardhat-gas-reporter, 测试时gas报告工具
开关在hardhat.config.js中配置

npx hardhat coverage 代码覆盖率