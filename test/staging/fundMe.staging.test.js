const { ethers } = require("hardhat")
const { assert, expect, equal } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const { developmentChains } = require("../../helper-hardhatconfig")

developmentChains.includes(network.name)
? describe.skip
: describe("test fundme contract", async function() {
    let fundMe
    let firstAccount
    //在运行每一个it之前都会运行一次
    beforeEach(async function() {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
    })

    //test fund and getFund successfully
    it("fund and getFund successfully", async function() {
        //make sure target reached
        await fundMe.fund({value: 30})
        //make sure windows close
        await new Promise(resolve => setTimeout(resolve, 181 * 1000))
        //make sure we can get receipt
        const getFundTx = await fundMe.getFund()
        const getFundReceipt = await getFundTx.wait()
        expect(getFundReceipt).to.be.emit(fundMe, "FundWithdrawByOwner").withArgs(30)
    })

    //test fund and refund successfully
    it("fund and refund successfully", async function() {
        //make sure target not reached
        await fundMe.fund({value: 10})
        //make sure windows close
        await new Promise(resolve => setTimeout(resolve, 181 * 1000))
        //make sure we can get receipt
        const reFundTx = await fundMe.reFund()
        const reFundReceipt = await reFundTx.wait()
        expect(reFundReceipt).to.be.emit(fundMe, "RefundByFunder").withArgs(10)
    })
})