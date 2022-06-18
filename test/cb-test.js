/* global BigInt */
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptoBlessing", function () {

    const BUSD_ADDRESS = "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee";

    let cbToken, cryptoBlessing;


    var deployCBToken = async function () {
        const CBToken = await ethers.getContractFactory("CBToken");
        cbToken = await CBToken.deploy();
        await cbToken.deployed();
    }

    var deployCryptoBlessing = async function () {
        const CryptoBlessing = await ethers.getContractFactory("CryptoBlessing");
        cryptoBlessing = await CryptoBlessing.deploy(BUSD_ADDRESS, cbToken.address);
        await cryptoBlessing.deployed();
    }

    it("Should append or remove one blessing from the blessing pool?", async function () {

        // deploy contracts
        await deployCBToken();
        await deployCryptoBlessing();
        
        let allBlessings = await cryptoBlessing.getAllBlessings()
        expect(allBlessings.length).to.equal(0);

        // add blessing to the pool
        const addBlessingTx = await cryptoBlessing.addBlessing("blessing image", "gong xi fa cai", BigInt(1 * 10 ** 18), 1);
        await addBlessingTx.wait();
        allBlessings = await cryptoBlessing.getAllBlessings()
        expect(allBlessings.length).to.equal(1);
        expect(allBlessings[0].image).to.equal("blessing image");

        // add another blessing to the pool
        const addBlessingTx2 = await cryptoBlessing.addBlessing("make love, not war", "make love, not war", BigInt(9.9 * 10 ** 18), 2);
        await addBlessingTx2.wait();
        allBlessings = await cryptoBlessing.getAllBlessings()
        expect(allBlessings.length).to.equal(2);
        expect(allBlessings[1].price).to.equal(BigInt(9.9 * 10 ** 18));

        // remove blessing from the pool
        const removeBlessingTx = await cryptoBlessing.removeBlessing(allBlessings[0].image);
        await removeBlessingTx.wait();
        allBlessings = await cryptoBlessing.getAllBlessings()
        expect(allBlessings.length).to.equal(1);
        expect(allBlessings[0].image).to.equal("make love, not war");

    });



    // it("Should not append or remove one blessing from the blessing pool?", async function () {

    //     const [owner, anotherAddress] = await ethers.getSigners();

    //     // deploy contracts
    //     await deployCBToken();
    //     await deployCryptoBlessing();

    //     // add blessing to the pool
    //     await cryptoBlessing.connect(anotherAddress).removeBlessing("test image");
    //     await cryptoBlessing.connect(anotherAddress).addBlessing("blessing image", "gong xi fa cai", BigInt(1 * 10 ** 18), 1);
    //     // remove blessing from the pool
    //     // await cryptoBlessing.connect(anotherAddress).removeBlessing("test image");
    // });


});
