/* global BigInt */
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptoBlessing", function () {

    let cbToken, BUSD, cryptoBlessing;

    var deployCBToken = async function () {
        const CBToken = await ethers.getContractFactory("CBToken");
        cbToken = await CBToken.deploy();   
        await cbToken.deployed();
    }

    var deployCryptoBlessing = async function () {
        const CryptoBlessing = await ethers.getContractFactory("CryptoBlessing");
        cryptoBlessing = await CryptoBlessing.deploy(BUSD.address, cbToken.address);
        await cryptoBlessing.deployed();
    }

    var deployBUSD = async function () {
        const BUSDC = await ethers.getContractFactory("BUSD");
        BUSD = await BUSDC.deploy();
        await BUSD.deployed();
    }

    it("Should append or remove one blessing from the blessing pool?", async function () {
        const [owner, anotherAddress] = await ethers.getSigners();
        // deploy contracts
        await deployCBToken();
        await deployBUSD();
        await deployCryptoBlessing();
        
        let allBlessings = await cryptoBlessing.getAllBlessings()
        expect(allBlessings.length).to.equal(0);

        // add blessing to the pool
        const addBlessingTx = await cryptoBlessing.addBlessing("blessing image", owner.address, "gong xi fa cai", BigInt(1 * 10 ** 18), 1);
        await addBlessingTx.wait();
        allBlessings = await cryptoBlessing.getAllBlessings()
        expect(allBlessings.length).to.equal(1);
        expect(allBlessings[0].image).to.equal("blessing image");

        // add another blessing to the pool
        const addBlessingTx2 = await cryptoBlessing.addBlessing("make love, not war", owner.address, "make love, not war", BigInt(9.9 * 10 ** 18), 2);
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



    it("Should not append or remove one blessing from the blessing pool?", async function () {

        const [owner, anotherAddress] = await ethers.getSigners();

        // deploy contracts
        await deployCBToken();
        await deployBUSD();
        await deployCryptoBlessing();

        // add blessing to the pool
        let err = "";
        try {
            await cryptoBlessing.connect(anotherAddress).addBlessing("blessing image", owner.address,  "gong xi fa cai", BigInt(1 * 10 ** 18), 1);
        } catch(e) {
            err = e.message;
        }
        console.log(err)
        expect(err).to.equal("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'");
        // remove blessing from the pool
        try {
            await cryptoBlessing.connect(anotherAddress).removeBlessing("test image");
        } catch(e) {
            err = e.message;
        }
        expect(err).to.equal("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'");
    });

    it("Should send a blessing?", async function () {

        const [owner, blessingOwner] = await ethers.getSigners();
        const blessingKeypair = ethers.Wallet.createRandom();
        // deploy contracts
        await deployCBToken();
        await deployBUSD();
        await deployCryptoBlessing();

        const sendBUSDAmount = BigInt(200 * 10 ** 18);
        const blessingPrice = BigInt(1 * 10 ** 18);
        const claimQuantity = 10;

        // 0 allowance
        const approveBUSDTx = await BUSD.approve(cryptoBlessing.address, BigInt(210 * 10 ** 18));
        await approveBUSDTx.wait();

        // 1 add blessing to the pool
        const addBlessingTx = await cryptoBlessing.addBlessing("blessing image", blessingOwner.address, "gong xi fa cai", blessingPrice, 1);
        await addBlessingTx.wait();

        // 2 check the balance of the sender BUSD = 400
        let senderBUSD = await BUSD.balanceOf(owner.address);
        console.log("senderBUSD: ", senderBUSD);
        // 2 send blessing
        const sendBlessingTx = await cryptoBlessing.sendBlessing(
            "blessing image", blessingKeypair.address, 
            sendBUSDAmount, 
            claimQuantity,
            0 
        );
        await sendBlessingTx.wait();
        senderBUSD = await BUSD.balanceOf(owner.address);
        console.log("after send senderBUSD: ", senderBUSD);
        expect(senderBUSD).to.equal(BigInt(190 * 10 ** 18));
        let cbBUSD = await BUSD.balanceOf(cryptoBlessing.address);
        console.log("after send cbBUSD: ", cbBUSD);
        expect(cbBUSD).to.equal(BigInt(200 * 10 ** 18));
        let blessingOwnerBUSD = await BUSD.balanceOf(blessingOwner.address);
        expect(blessingOwnerBUSD).to.equal(BigInt(10 * 10 ** 18));

        let mySendedBlessings = await cryptoBlessing.getMySendedBlessings()
        expect(mySendedBlessings.length).to.equal(1);
        expect(mySendedBlessings[0].blessingID).to.equal(blessingKeypair.address);
        expect(mySendedBlessings[0].claimType).to.equal(0);
    });

    it("Should claim the blessing(random)?", async function () {

        const [owner, blessingOwner, claimer] = await ethers.getSigners();
        const blessingKeypair = ethers.Wallet.createRandom();
        // const blessingKeypair = web3.eth.accounts.create();
        // deploy contracts
        await deployCBToken();
        await deployBUSD();
        await deployCryptoBlessing();

        const sendBUSDAmount = BigInt(200 * 10 ** 18);
        const blessingPrice = BigInt(1 * 10 ** 18);
        const claimQuantity = 10;

        // 0 allowance
        const approveBUSDTx = await BUSD.approve(cryptoBlessing.address, BigInt(210 * 10 ** 18));
        await approveBUSDTx.wait();

        // 1 add blessing to the pool
        const addBlessingTx = await cryptoBlessing.addBlessing("blessing image", blessingOwner.address, "gong xi fa cai", blessingPrice, 1);
        await addBlessingTx.wait();

        // 2 send blessing
        const sendBlessingTx = await cryptoBlessing.sendBlessing(
            "blessing image", blessingKeypair.address, 
            sendBUSDAmount, 
            claimQuantity,
            0 
        );
        await sendBlessingTx.wait();
        console.log("start to sign the blessing, the private key is: ", blessingKeypair.privateKey);
        console.log("public key:", blessingKeypair.address);
        const MESSAGE = web3.utils.sha3('CryptoBlessing');
        // const signature = await blessingKeypair.signMessage(MESSAGE)
        const signature = await web3.eth.accounts.sign(MESSAGE, blessingKeypair.privateKey);
        // const signature = await web3.eth.sign(MESSAGE, blessingKeypair.address);
        // 3 claim the blessing
        const claimBlessingTx = await cryptoBlessing.connect(claimer).claimBlessing(
            owner.address,
            blessingKeypair.address,
            toEthSignedMessageHash(MESSAGE),
            signature.signature,
        );
        await claimBlessingTx.wait();
        let claimerBUSD = await BUSD.balanceOf(claimer.address);
        expect(claimerBUSD).to.equal(BigInt(200 * 10 ** 18 / 10 * 95 / 100));
        let myClaimedBlessings = await cryptoBlessing.connect(claimer).getMyClaimedBlessings()
        expect(myClaimedBlessings.length).to.equal(1);
        console.log("myClaimedBlessings: ", myClaimedBlessings);
        let blessingClaimingStatus = await cryptoBlessing.getBlessingClaimingStatus(blessingKeypair.address)
        expect(blessingClaimingStatus.length).to.equal(1);
        console.log("blessingClaimingStatus: ", blessingClaimingStatus);
    });

    function toEthSignedMessageHash (messageHex) {
        const messageBuffer = Buffer.from(messageHex.substring(2), 'hex');
        const prefix = Buffer.from(`\u0019Ethereum Signed Message:\n${messageBuffer.length}`);
        return web3.utils.sha3(Buffer.concat([prefix, messageBuffer]));
    }

});
