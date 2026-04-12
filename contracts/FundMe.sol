// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
//C:\Users\陈\Desktop\Pragram\hardhat\Web3_tutorial\node_modules\@chainlink\contracts\src\v0.8\shared\interfaces\AggregatorV3Interface.sol

/*
1. 创建一个收款函数
2. 记录投资人并且查看
3. 在锁定期内, 达到目标值, 生产商可以提款
4. 在锁定期内, 没有达到目标值, 投资人可以在锁定期后退款
*/ 

contract FundMe {

    mapping (address => uint256) public funderToAmount;

    uint256 constant MINIMUM_VALUE = 1;

    uint256 constant TARGET = 3;

    address owner;

    // AggregatorV3Interface internal dataFeed;

    uint256 deploymentTimestamp;
    uint lockTime;

    address erc20Addr;

    bool public getFundSuccess = false;

    constructor(){
        //sep测试网
        // dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        owner = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
        deploymentTimestamp = block.timestamp;
        lockTime = 1 * 60 * 60;
    }

    function fund() external payable {
        require(msg.value >= MINIMUM_VALUE, "VALUE < 1");
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
        require(address(this).balance >= TARGET, "balance < 1");
        //transfer
        // payable(msg.sender).transfer(address(this).balance);

        //send 反回bool
        // bool success = payable(msg.sender).send(address(this).balance);
        // require(success);

        //call
        bool success;
        (success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "transfer tx failes");
        funderToAmount[msg.sender] = 0;
        getFundSuccess = true;
    }

    function refund() external windowClose {
        require(address(this).balance < TARGET, "balance >= 1");
        uint256 amount = funderToAmount[msg.sender];
        require(amount != 0, "user's value = 0");
        funderToAmount[msg.sender] = 0;
        bool success;
        (success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "transfer tx failes");
    }

    function setFunderToAmount(address funder, uint256 amountToUpdate) external {
        require(msg.sender == erc20Addr, "not");
        funderToAmount[funder] = amountToUpdate;
    }

    function setErc20Addr(address _erc20Addr) public onlyOwner{
        erc20Addr = _erc20Addr;
    }

    modifier windowClose() {
        require(block.timestamp > deploymentTimestamp + lockTime, "windows is closed");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "you are not pwner");
        _;
    }
}