// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
//C:\Users\陈\Desktop\Pragram\hardhat\Web3_tutorial\node_modules\@chainlink\contracts\src\v0.8\shared\interfaces\AggregatorV3Interface.sol

/*
1. 创建一个收款函数
2. 记录投资人并且查看
3. 在锁定期内, 达到目标值, 生产商可以提款
4. 在锁定期内, 没有达到目标值, 投资人可以在锁定期后退款
*/ 

contract FundMe {

    mapping (address => uint256) public funderToAmount;

    uint256 constant MINIMUM_VALUE = 10;

    uint256 constant TARGET = 30;

    address public owner;

    AggregatorV3Interface internal dataFeed;

    uint256 deploymentTimestamp;
    uint lockTime;

    address erc20Addr;

    bool public getFundSuccess = false;
    event FundWithdrawnByOwner(uint256);
    event RefundByFunder(address, uint256);

    constructor(address dataFeedAddr){
        //sep测试网
        dataFeed = AggregatorV3Interface(dataFeedAddr);
        owner = msg.sender;
        deploymentTimestamp = block.timestamp;
        lockTime = 3 * 60;
    }

    function fund() external payable {
        require(msg.value >= MINIMUM_VALUE, "VALUE < 10");
        require(block.timestamp < deploymentTimestamp + lockTime, "windows is closed");
        funderToAmount[msg.sender] += msg.value;
    }

    // function getChainlinkDataFeedLatestAnswer() public view returns (int256) {
    // // prettier-ignore
    //     (
    //         /* uint80 roundId */,
    //         int256 answer,
    //         /*uint256 startedAt*/,
    //         /*uint256 updatedAt*/,
    //         /*uint80 answeredInRound*/
    //     ) = dataFeed.latestRoundData();
    //     return answer;
    // }

    // function convertEthToUsd(uint256 ethAmount) internal view returns (uint256) {
    //     uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
    //     return ethAmount * ethPrice / 10 ** 8;
    // }

    function transferOwnership(address newowner) public onlyOwner {
        owner = newowner;
    }

    function getFund() external windowClose onlyOwner {
        require(address(this).balance >= TARGET, "balance < 30");
        //transfer
        // payable(msg.sender).transfer(address(this).balance);

        //send 反回bool
        // bool success = payable(msg.sender).send(address(this).balance);
        // require(success);

        //call
        bool success;
        uint256 balance = address(this).balance;
        (success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "transfer tx failes");
        funderToAmount[msg.sender] = 0;
        getFundSuccess = true;
        emit FundWithdrawnByOwner(balance);
    }

    function refund() external windowClose {
        require(address(this).balance < TARGET, "balance >= 30");
        uint256 amount = funderToAmount[msg.sender];
        require(amount != 0, "user's value = 0");
        funderToAmount[msg.sender] = 0;
        bool success;
        (success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "transfer tx failes");
        emit RefundByFunder(msg.sender, amount);
    }

    function setFunderToAmount(address funder, uint256 amountToUpdate) external {
        require(msg.sender == erc20Addr, "not");
        funderToAmount[funder] = amountToUpdate;
    }

    function setErc20Addr(address _erc20Addr) public onlyOwner{
        erc20Addr = _erc20Addr;
    }

    modifier windowClose() {
        require(block.timestamp > deploymentTimestamp + lockTime, "windows open");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "you are not pwner");
        _;
    }
}