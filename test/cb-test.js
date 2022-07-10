/* global BigInt */
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptoBlessing", function () {

    let BUSD, cryptoBlessing, cbToken, cbNFT;

    var deployCryptoBlessing = async function () {
        const CryptoBlessing = await ethers.getContractFactory("CryptoBlessing");
        cryptoBlessing = await CryptoBlessing.deploy(BUSD.address, cbToken.address, cbNFT.address);
        await cryptoBlessing.deployed();
    }

    var deployBUSD = async function () {
        const BUSDC = await ethers.getContractFactory("BUSD");
        BUSD = await BUSDC.deploy();
        await BUSD.deployed();
    }

    var deployCBToken = async function () {
        const CBToken = await ethers.getContractFactory("CryptoBlessingToken");
        cbToken = await CBToken.deploy();   
        await cbToken.deployed();
    }

    var deployCBNFT = async function () {
        const CryptoBlessingNFT = await ethers.getContractFactory("CryptoBlessingNFT");
        cbNFT = await CryptoBlessingNFT.deploy();   
        await cbNFT.deployed();
    }

    it("Should append or remove one blessing from the blessing pool?", async function () {
        const [owner, anotherAddress] = await ethers.getSigners();

        // deploy contracts
        await deployCBToken();
        await deployCBNFT();
        await deployBUSD();
        await deployCryptoBlessing();
        
        let allBlessings = await cryptoBlessing.getAllBlessings()
        expect(allBlessings.length).to.equal(0);

        // add blessing to the pool
        const addBlessingTx = await cryptoBlessing.addBlessing("blessing image", owner.address, "gong xi fa cai", BigInt(1 * 10 ** 18), 1, 10);
        await addBlessingTx.wait();
        allBlessings = await cryptoBlessing.getAllBlessings()
        expect(allBlessings.length).to.equal(1);
        expect(allBlessings[0].image).to.equal("blessing image");

        // add another blessing to the pool
        const addBlessingTx2 = await cryptoBlessing.addBlessing("make love, not war", owner.address, "make love, not war", BigInt(9.9 * 10 ** 18), 2, 10);
        await addBlessingTx2.wait();
        allBlessings = await cryptoBlessing.getAllBlessings()
        expect(allBlessings.length).to.equal(2);
        expect(allBlessings[1].price).to.equal(BigInt(9.9 * 10 ** 18));
        expect(allBlessings[1].deleted).to.equal(0);

        // remove blessing from the pool
        const removeBlessingTx = await cryptoBlessing.updateBlessing(allBlessings[0].image, BigInt(1 * 10 ** 18), 1, 10);
        await removeBlessingTx.wait();
        allBlessings = await cryptoBlessing.getAllBlessings()
        expect(allBlessings.length).to.equal(2);
        expect(allBlessings[0].deleted).to.equal(1);

        // recover blessing from the pool
        const recoverBlessingTx = await cryptoBlessing.updateBlessing(allBlessings[0].image, BigInt(9.9 * 10 ** 18), 0, 10);
        await recoverBlessingTx.wait();
        allBlessings = await cryptoBlessing.getAllBlessings()
        expect(allBlessings[0].deleted).to.equal(0);
    });

    it("Should batch add blessings", async function () {
        const [owner, anotherAddress] = await ethers.getSigners();

        // deploy contracts
        await deployCBToken();
        await deployCBNFT();
        await deployBUSD();
        await deployCryptoBlessing();
        
        let allBlessings = await cryptoBlessing.getAllBlessings()
        expect(allBlessings.length).to.equal(0);

        const addBlessingTx = await cryptoBlessing.addBlessing("blessing image", owner.address, "gong xi fa cai", BigInt(1 * 10 ** 18), 1, 10);
        await addBlessingTx.wait();

        // batch add blessing to the pool
        const batchAddBlessingTx = await cryptoBlessing.batchAddBlessing([{
            image: "blessing image", 
            description: "gong xi fa cai", 
            price: BigInt(9 * 10 ** 18), 
            owner: owner.address, 
            blessingType: 0,
            timestamp: 0, 
            deleted: 1, 
            taxRate: 10
        }, 
        {
            image: "batch", 
            description: "gong xi fa cai", 
            price: BigInt(9 * 10 ** 18), 
            owner: owner.address, 
            blessingType: 0,
            timestamp: 0, 
            deleted: 1, 
            taxRate: 10
        }, 
        ]);
        await batchAddBlessingTx.wait();
        allBlessings = await cryptoBlessing.getAllBlessings()
        expect(allBlessings.length).to.equal(3);
        expect(allBlessings[1].price).to.equal(BigInt(9 * 10 ** 18));
        expect(allBlessings[2].image).to.equal("batch");
    });




    it("Should not append or remove one blessing from the blessing pool?", async function () {

        const [owner, anotherAddress] = await ethers.getSigners();

        // deploy contracts
        await deployCBToken();
        await deployCBNFT();
        await deployBUSD();
        await deployCryptoBlessing();

        // add blessing to the pool
        let err = "";
        try {
            await cryptoBlessing.connect(anotherAddress).addBlessing("blessing image", owner.address,  "gong xi fa cai", BigInt(1 * 10 ** 18), 1, 10);
        } catch(e) {
            err = e.message;
        }
        console.log(err)
        expect(err).to.equal("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'");

        // remove blessing from the pool
        try {
            await cryptoBlessing.connect(anotherAddress).updateBlessing("test image", BigInt(0.9 * 10 ** 18), 1, 10);
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
        await deployCBNFT();
        await deployBUSD();
        await deployCryptoBlessing();

        const sendBUSDAmount = BigInt(200 * 10 ** 18);
        const blessingPrice = BigInt(1 * 10 ** 18);
        const claimQuantity = 10;

        // 0 allowance
        const approveBUSDTx = await BUSD.approve(cryptoBlessing.address, BigInt(210 * 10 ** 18));
        await approveBUSDTx.wait();

        // 1 add blessing to the pool
        const addBlessingTx = await cryptoBlessing.addBlessing("blessing image", blessingOwner.address, "gong xi fa cai", blessingPrice, 1, 10);
        await addBlessingTx.wait();

        // 2 check the balance of the sender BUSD = 400
        let senderBUSD = await BUSD.balanceOf(owner.address);

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
        expect(senderBUSD).to.equal(BigInt(190 * 10 ** 18 + 10 * 10 / 100 * 10 ** 18));

        let cbBUSD = await BUSD.balanceOf(cryptoBlessing.address);
        console.log("after send cbBUSD: ", cbBUSD);
        expect(cbBUSD).to.equal(BigInt(200 * 10 ** 18));

        let blessingOwnerBUSD = await BUSD.balanceOf(blessingOwner.address);
        expect(blessingOwnerBUSD).to.equal(BigInt(10 * 90 / 100 * 10 ** 18));

        let mySendedBlessings = await cryptoBlessing.getMySendedBlessings()
        expect(mySendedBlessings.length).to.equal(1);
        expect(mySendedBlessings[0].blessingID).to.equal(blessingKeypair.address);
        expect(mySendedBlessings[0].claimType).to.equal(0);
    });

    it("Should claim the blessing(avarage)?", async function () {

        const [owner, sender, blessingOwner, claimer] = await ethers.getSigners();
        const blessingKeypair = ethers.Wallet.createRandom();

        // const blessingKeypair = web3.eth.accounts.create();
        // deploy contracts
        await deployCBToken();
        await deployCBNFT();
        await deployBUSD();
        await deployCryptoBlessing();

        let ownerCB = await cbToken.balanceOf(owner.address);
        expect(ownerCB).to.equal(BigInt(79 * 100000000));

        // transfer 7.9 billion CB token to the contract
        const transferCBTx = await cbToken.transfer(cryptoBlessing.address, BigInt(79 * 100000000));
        await transferCBTx.wait();
        let  blessingCB = await cbToken.balanceOf(cryptoBlessing.address);
        expect(blessingCB).to.equal(BigInt(79 * 100000000));
        ownerCB = await cbToken.balanceOf(owner.address);
        expect(ownerCB).to.equal(BigInt(0));

        // transfer the owner of CBNFT to the owner of CryptoBlessing.
        await cbNFT.transferOwnership(cryptoBlessing.address);

        const sendBUSDAmount = BigInt(200 * 10 ** 18);
        const blessingPrice = BigInt(1 * 10 ** 18);
        const claimQuantity = 10;

        const transferBUSDTx = await BUSD.transfer(sender.address, BigInt(400 * 10 ** 18));
        await transferBUSDTx.wait();

        // 0 allowance
        const approveBUSDTx = await BUSD.connect(sender).approve(cryptoBlessing.address, BigInt(210 * 10 ** 18));
        await approveBUSDTx.wait();

        // 1 add blessing to the pool
        const addBlessingTx = await cryptoBlessing.addBlessing("blessing image", blessingOwner.address, "gong xi fa cai", blessingPrice, 1, 10);
        await addBlessingTx.wait();

        // 2 send blessing
        const sendBlessingTx = await cryptoBlessing.connect(sender).sendBlessing(
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

        let cbNFTCount = await cbNFT.balanceOf(claimer.address)
        expect(cbNFTCount).to.equal(0);

        // 3 claim the blessing
        const claimBlessingTx = await cryptoBlessing.connect(claimer).claimBlessing(
            sender.address,
            blessingKeypair.address,
            toEthSignedMessageHash(MESSAGE),
            signature.signature,
            claimer.address
        );
        await claimBlessingTx.wait();
        let claimerBUSD = await BUSD.balanceOf(claimer.address);
        expect(claimerBUSD).to.equal(BigInt(200 * 10 ** 18 / 10 * 99 / 100));
        let myClaimedBlessings = await cryptoBlessing.connect(claimer).getMyClaimedBlessings()
        expect(myClaimedBlessings.length).to.equal(1);
        console.log("myClaimedBlessings: ", myClaimedBlessings);
        let blessingClaimingStatus = await cryptoBlessing.getBlessingClaimingStatus(blessingKeypair.address)
        expect(blessingClaimingStatus.length).to.equal(1);
        console.log("blessingClaimingStatus: ", blessingClaimingStatus);
        let senderCB = await cbToken.balanceOf(sender.address);
        expect(senderCB).to.equal(BigInt(100));

        // check the nft
        cbNFTCount = await cbNFT.balanceOf(claimer.address)
        expect(cbNFTCount).to.equal(1);

    });


    it("Should not claim the blessing(avarage)?", async function () {

        const [owner, sender, blessingOwner, claimer1, claimer2, claimer3] = await ethers.getSigners();
        const blessingKeypair = ethers.Wallet.createRandom();
        const blessingKeypairFake = ethers.Wallet.createRandom();

        // const blessingKeypair = web3.eth.accounts.create();
        // deploy contracts
        await deployCBToken();
        await deployCBNFT();
        await deployBUSD();
        await deployCryptoBlessing();

        let ownerCB = await cbToken.balanceOf(owner.address);
        expect(ownerCB).to.equal(BigInt(79 * 100000000));

        // transfer 7.9 billion CB token to the contract
        const transferCBTx = await cbToken.transfer(cryptoBlessing.address, BigInt(79 * 100000000));
        await transferCBTx.wait();
        let  blessingCB = await cbToken.balanceOf(cryptoBlessing.address);
        expect(blessingCB).to.equal(BigInt(79 * 100000000));
        ownerCB = await cbToken.balanceOf(owner.address);
        expect(ownerCB).to.equal(BigInt(0));

        // transfer the owner of CBNFT to the owner of CryptoBlessing.
        await cbNFT.transferOwnership(cryptoBlessing.address);

        const sendBUSDAmount = BigInt(200 * 10 ** 18);
        const blessingPrice = BigInt(1 * 10 ** 18);
        const claimQuantity = 10;

        const transferBUSDTx = await BUSD.transfer(sender.address, BigInt(400 * 10 ** 18));
        await transferBUSDTx.wait();

        // 0 allowance
        const approveBUSDTx = await BUSD.connect(sender).approve(cryptoBlessing.address, BigInt(210 * 10 ** 18));
        await approveBUSDTx.wait();

        // 1 add blessing to the pool
        const addBlessingTx = await cryptoBlessing.addBlessing("blessing image", blessingOwner.address, "gong xi fa cai", blessingPrice, 1, 10);
        await addBlessingTx.wait();

        // 2 send blessing
        const sendBlessingTx = await cryptoBlessing.connect(sender).sendBlessing(
            "blessing image", blessingKeypair.address, 
            sendBUSDAmount, 
            claimQuantity,
            0 
        );
        await sendBlessingTx.wait();

        const MESSAGE = web3.utils.sha3('CryptoBlessing');
        const signature = await web3.eth.accounts.sign(MESSAGE, blessingKeypair.privateKey);

        // 3 fake  claim the blessing
        const claimBlessingTx = await cryptoBlessing.connect(claimer1).claimBlessing(
            sender.address,
            blessingKeypair.address,
            toEthSignedMessageHash(MESSAGE),
            signature.signature,
            claimer1.address
        );

        const claimBlessing2Tx = await cryptoBlessing.connect(claimer2).claimBlessing(
            sender.address,
            blessingKeypair.address,
            toEthSignedMessageHash(MESSAGE),
            signature.signature,
            claimer2.address
        );
        await claimBlessingTx.wait();
        await claimBlessing2Tx.wait();
        let claimerBUSD = await BUSD.balanceOf(claimer1.address);
        let claimer2BUSD = await BUSD.balanceOf(claimer2.address);
        expect(claimerBUSD).to.equal(BigInt(200 * 10 ** 18 / 10 * 99 / 100));
        expect(claimer2BUSD).to.equal(BigInt(200 * 10 ** 18 / 10 * 99 / 100));
    });

    function toEthSignedMessageHash (messageHex) {
        const messageBuffer = Buffer.from(messageHex.substring(2), 'hex');
        const prefix = Buffer.from(`\u0019Ethereum Signed Message:\n${messageBuffer.length}`);

        return web3.utils.sha3(Buffer.concat([prefix, messageBuffer]));
    }


    it("Should revoke a blessing?", async function () {

        const [owner, blessingOwner] = await ethers.getSigners();
        const blessingKeypair = ethers.Wallet.createRandom();

        // deploy contracts
        await deployCBToken();
        await deployCBNFT();
        await deployBUSD();
        await deployCryptoBlessing();

        const sendBUSDAmount = BigInt(200 * 10 ** 18);
        const blessingPrice = BigInt(1 * 10 ** 18);
        const claimQuantity = 10;

        // 0 allowance
        const approveBUSDTx = await BUSD.approve(cryptoBlessing.address, BigInt(210 * 10 ** 18));
        await approveBUSDTx.wait();

        // 1 add blessing to the pool
        const addBlessingTx = await cryptoBlessing.addBlessing("blessing image", blessingOwner.address, "gong xi fa cai", blessingPrice, 1, 10);
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

        let mySendedBlessings = await cryptoBlessing.getMySendedBlessings()
        expect(mySendedBlessings.length).to.equal(1);
        expect(mySendedBlessings[0].blessingID).to.equal(blessingKeypair.address);
        expect(mySendedBlessings[0].claimType).to.equal(0);
        expect(mySendedBlessings[0].revoked).to.equal(false);

        const revokeBlessingTx = await cryptoBlessing.revokeBlessing(blessingKeypair.address);
        await revokeBlessingTx.wait()
        mySendedBlessings = await cryptoBlessing.getMySendedBlessings()
        expect(mySendedBlessings.length).to.equal(1);
        expect(mySendedBlessings[0].revoked).to.equal(true);
    });


    it("Should claim the blessing(random)?", async function () {

        const [owner, sender, blessingOwner, claimer1, claimer2, claimer3, claimer4, claimer5] = await ethers.getSigners();
        const blessingKeypair = ethers.Wallet.createRandom();

        // const blessingKeypair = web3.eth.accounts.create();
        // deploy contracts
        await deployCBToken();
        await deployCBNFT();
        await deployBUSD();
        await deployCryptoBlessing();

        let ownerCB = await cbToken.balanceOf(owner.address);
        expect(ownerCB).to.equal(BigInt(79 * 100000000));

        // transfer 7.9 billion CB token to the contract
        const transferCBTx = await cbToken.transfer(cryptoBlessing.address, BigInt(79 * 100000000));
        await transferCBTx.wait();
        let  blessingCB = await cbToken.balanceOf(cryptoBlessing.address);
        expect(blessingCB).to.equal(BigInt(79 * 100000000));
        ownerCB = await cbToken.balanceOf(owner.address);
        expect(ownerCB).to.equal(BigInt(0));

        // transfer the owner of CBNFT to the owner of CryptoBlessing.
        await cbNFT.transferOwnership(cryptoBlessing.address);

        const sendBUSDAmount = BigInt(200 * 10 ** 18);
        const blessingPrice = BigInt(1 * 10 ** 18);
        const claimQuantity = 5;

        const transferBUSDTx = await BUSD.transfer(sender.address, BigInt(400 * 10 ** 18));
        await transferBUSDTx.wait();

        // 0 allowance
        const approveBUSDTx = await BUSD.connect(sender).approve(cryptoBlessing.address, BigInt(210 * 10 ** 18));
        await approveBUSDTx.wait();

        // 1 add blessing to the pool
        const addBlessingTx = await cryptoBlessing.addBlessing("blessing image", blessingOwner.address, "gong xi fa cai", blessingPrice, 1, 10);
        await addBlessingTx.wait();

        // 2 send blessing
        const sendBlessingTx = await cryptoBlessing.connect(sender).sendBlessing(
            "blessing image", blessingKeypair.address, 
            sendBUSDAmount, 
            claimQuantity,
            1
        );
        await sendBlessingTx.wait();
        console.log("start to sign the blessing, the private key is: ", blessingKeypair.privateKey);
        console.log("public key:", blessingKeypair.address);
        const MESSAGE = web3.utils.sha3('CryptoBlessing');
        
        // const signature = await blessingKeypair.signMessage(MESSAGE)
        const signature = await web3.eth.accounts.sign(MESSAGE, blessingKeypair.privateKey);

        // 3 claim the blessing
        const claim1BlessingTx = await cryptoBlessing.connect(claimer1).claimBlessing(
            sender.address,
            blessingKeypair.address,
            toEthSignedMessageHash(MESSAGE),
            signature.signature,
            claimer1.address
        );
        await claim1BlessingTx.wait();
        let claimer1BUSD = await BUSD.balanceOf(claimer1.address);
        console.log("claimer1BUSD: ", ethers.utils.formatEther(claimer1BUSD));


        const claim2BlessingTx = await cryptoBlessing.connect(claimer2).claimBlessing(
            sender.address,
            blessingKeypair.address,
            toEthSignedMessageHash(MESSAGE),
            signature.signature,
            claimer2.address
        );
        await claim2BlessingTx.wait();
        let claimer2BUSD = await BUSD.balanceOf(claimer2.address);
        console.log("claimer2BUSD: ", ethers.utils.formatEther(claimer2BUSD));

        const claim3BlessingTx = await cryptoBlessing.connect(claimer3).claimBlessing(
            sender.address,
            blessingKeypair.address,
            toEthSignedMessageHash(MESSAGE),
            signature.signature,
            claimer3.address
        );
        await claim3BlessingTx.wait();
        let claimer3BUSD = await BUSD.balanceOf(claimer3.address);
        console.log("claimer3BUSD: ", ethers.utils.formatEther(claimer3BUSD));

        const claim4BlessingTx = await cryptoBlessing.connect(claimer4).claimBlessing(
            sender.address,
            blessingKeypair.address,
            toEthSignedMessageHash(MESSAGE),
            signature.signature,
            claimer4.address
        );
        await claim4BlessingTx.wait();
        let claimer4BUSD = await BUSD.balanceOf(claimer4.address);
        console.log("claimer4BUSD: ", ethers.utils.formatEther(claimer4BUSD));

        const claim5BlessingTx = await cryptoBlessing.connect(claimer5).claimBlessing(
            sender.address,
            blessingKeypair.address,
            toEthSignedMessageHash(MESSAGE),
            signature.signature,
            claimer5.address
        );
        await claim5BlessingTx.wait();
        let claimer5BUSD = await BUSD.balanceOf(claimer5.address);
        console.log("claimer5BUSD: ", ethers.utils.formatEther(claimer5BUSD));

        console.log("totalBUSD: ", parseFloat(ethers.utils.formatEther(claimer1BUSD)) 
            + parseFloat(ethers.utils.formatEther(claimer2BUSD))
            + parseFloat(ethers.utils.formatEther(claimer3BUSD)) 
            + parseFloat(ethers.utils.formatEther(claimer4BUSD)) 
            + parseFloat(ethers.utils.formatEther(claimer5BUSD)));

    });

    it("Upgrade to next version?", async function () {
        // deploy contracts
        await deployCBToken();
        await deployCBNFT();
        await deployBUSD();
        await deployCryptoBlessing();

        const transferCBTx = await cbToken.transfer(cryptoBlessing.address, BigInt(79 * 100000000));
        await transferCBTx.wait();

        // transfer the owner of CBNFT to the owner of CryptoBlessing.
        await cbNFT.transferOwnership(cryptoBlessing.address);

        const CryptoBlessing2 = await ethers.getContractFactory("CryptoBlessing");
        let cryptoBlessing2 = await CryptoBlessing2.deploy(BUSD.address, cbToken.address, cbNFT.address);
        await cryptoBlessing2.deployed();

        let  blessingCB = await cbToken.balanceOf(cryptoBlessing2.address);
        console.log("blessingCB: ", blessingCB);

        const pausedTx = await cryptoBlessing.pause();
        await pausedTx.wait();

        const upgradeToV2Tx = await cryptoBlessing.upgradeToNextVersion(cryptoBlessing2.address);
        await upgradeToV2Tx.wait();

        blessingCB = await cbToken.balanceOf(cryptoBlessing2.address);
        console.log("blessingCB: ", blessingCB);
    });

});
