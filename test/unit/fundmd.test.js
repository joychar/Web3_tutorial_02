const { ethers, network } = require("hardhat")
const { assert, expect, equal } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const { developmentChains } = require("../../helper-hardhatconfig")

! developmentChains.includes(network.name)
? describe.skip
: describe("test fundme contract", async function() {
    let fundMe
    let fundMeSecondAccount
    let firstAccount
    let secondAccount
    //在运行每一个it之前都会运行一次
    beforeEach(async function() {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        secondAccount = (await getNamedAccounts()).secondAccount
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
        fundMeSecondAccount = await ethers.getContract("FundMe", secondAccount)
    })

    it("test if the owner is msg.sender", async function() {
        // const [firstAccount] = await ethers.getSigners()
        // const fundMeFactory = await ethers.getContractFactory("FundMe")
        // const fundMe = await fundMeFactory.deploy()
        await fundMe.waitForDeployment()

        assert.equal((await fundMe.owner()), firstAccount) //getSigners需要另外读地址,但是现在不用
    })

    //fund, getfund, refund(注意我这里时间估计要进行更改)
    //uint test for fund
    it("window closed, value grate than minimum, fund failed",
        async function() {
            //make sure the window is closed
            await helpers.time.increase(20 * 60)
            await helpers.mine()
            //value is greater minimum value
            await expect(fundMe.fund({value: 20})).to.be.revertedWith("window is closed")
        }
    ) 

    it("window open, value less than minimum, fund failed",
        async function() {
            await expect(fundMe.fund({value: 9})).to.be.revertedWith("value is less than minimum")
        }
    )

    it("window open, value grate than minimum, fund success",
        async function() {
            await fundMe.fund({value: 10})
            const balance = await fundMe.funderToAmount(firstAccount)
            await expect(balance).to.equal(10)
        }
    )
    //expect前面要加await,不然这个测试一直都是通过的

    //unit test for getFund
    //onlyOwner, window closed, target reached
    it("not owner, window closed, target reached, getFund failed", 
        async function() {
            await fundMe.fund({value: 30})
            await helpers.time.increase(20 * 60)
            await helpers.mine()
            await expect(fundMeSecondAccount.getFund()).to.be.revertedWith("not owner")
        }
    )

    it("owner, window open, target reached, getFund failed",
        async function() {
            await fundMe.fund({value: 30})
            await expect(fundMe.getFund()).to.be.revertedWith("window is open")
        }
    )

    it("owner, window closed, target is not reached, getFund success",
        async function() {
            await helpers.time.increase(20 * 60)
            await helpers.mine()
            await expect(fundMe.getFund()).to.be.revertedWith("target is not reached")
        }
    )

    it("owner, window closed, target reached, getFund success",
        async function() {
            await fundMe.fund({value: 30})
            await helpers.time.increase(20 * 60)
            await helpers.mine()
            await expect(fundMe.getFund()).to.emit(fundMe, "FundWithdrawnByOwner").withArgs("30")
        }
    )//之前出问题是因为合约里的balance已经被转走了,我换成先计数就行了
    

    //unit test for refund
    //window closed, target not reached, funder has balance
    it("window open, target not reached, funder has balance, refund failed", 
        async function() {
            await fundMe.fund({value: 10})
            await expect(fundMe.refund()).to.be.revertedWith("window is open")
        }
    )

    it("window closed, target reached, funder has balance, refund failed",
        async function() {
            await fundMe.fund({value: 30})
            await helpers.time.increase(20 * 60)
            await helpers.mine()
            await expect(fundMe.refund()).to.be.revertedWith("target is not reached")
        }
    )

    it("window closed, target not reached, funder dose not has balance, refund failed",
        async function() {
            await helpers.time.increase(20 * 60)
            await helpers.mine()
            await expect(fundMe.refund()).to.be.revertedWith("funder dose not has balance")
        }
    )

    it("window closed, target not reached, funder has balance, refund success",
        async function() {
            await fundMe.fund({value: 10})
            await helpers.time.increase(20 * 60)
            await helpers.mine()
            await expect(fundMe.refund()).to.emit(fundMe, "RefundByFunder").withArgs(firstAccount, "10")
        }
    )
})