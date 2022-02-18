const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EspanaMetod", function () {

    beforeEach(async function () {
        EspanaMetodContract = await ethers.getContractFactory("EspanaMetod");
        emContract = await EspanaMetodContract.deploy();
        [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, ...addrs] = await ethers.getSigners();
    });

    it("Open Swap with zero msg.value should fail", async function () {
        
        await expect(emContract.connect(addr2).openSwap("", { value: 0})).to.be.revertedWith("EspanaMetod: Opening a swap with value less than minimum. ");
    });

    it("Open Swap with proper msg.value should pass", async function () {
        
        await expect(emContract.connect(addr2).openSwap("", { value: 1000}));
        expect(await emContract.swapCount()).to.equal(1);
    });

    it("Refunding a swap should work. ", async function () {
        
        await expect(emContract.connect(addr2).openSwap("", { value: 1000}));
        await expect(emContract.connect(addr2).refundSwap(0));
        expect(await emContract.swapCount()).to.equal(1);
    });

    it("Refunding a swap by different address should not work. ", async function () {
        
        await expect(emContract.connect(addr2).openSwap("", { value: 1000}));
        await expect(emContract.connect(addr3).refundSwap(0)).to.be.revertedWith("EspanaMetod: Refunder isn't cryptoBuyer. ");
    });

    it("Calling a swap when cryptoBuyer == msg.sender should not work. ", async function () {
        
        await expect(emContract.connect(addr2).openSwap("", { value: 1000}));
        await expect(emContract.connect(addr2).callSwap(0, "")).to.be.revertedWith("EspanaMetod: msg.sender can not be cryptoBuyer. ");
    });

    it("Calling a swap when trade amount mismatch should not work. ", async function () {
        
        await expect(emContract.connect(addr2).openSwap("", { value: 1000}));
        await expect(emContract.connect(addr2).callSwap(0, "", { value: 10000 })).to.be.revertedWith("EspanaMetod: msg.sender can not be cryptoBuyer. ");
    });

    it("Calling a swap when trade amount match should work. ", async function () {
        
        await expect(emContract.connect(addr2).openSwap("", { value: 1000}));
        await expect(emContract.connect(addr2).callSwap(0, "", { value: 1000 }));
    });
});
