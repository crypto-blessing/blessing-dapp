/* global BigInt */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

    const BUSDC = await hre.ethers.getContractFactory("BUSD");
    let BUSD = await BUSDC.deploy();
    await BUSD.deployed();
    console.log("Fake BUSD deployed to:", BUSD.address);

    const CBToken = await hre.ethers.getContractFactory("CryptoBlessingToken");
    let cbToken = await CBToken.deploy();   
    await cbToken.deployed();
    console.log("CryptoBlessing token deployed to:", cbToken.address);

    const CryptoBlessingNFT = await hre.ethers.getContractFactory("CryptoBlessingNFT");
    let cbNFT = await CryptoBlessingNFT.deploy();   
    await cbNFT.deployed();
    console.log("CryptoBlessing NFT deployed to:", cbNFT.address);

    const CryptoBlessing = await hre.ethers.getContractFactory("CryptoBlessing");
    let cryptoBlessing = await CryptoBlessing.deploy(BUSD.address, cbToken.address, cbNFT.address);
    await cryptoBlessing.deployed();
    console.log("CryptoBlessing core contract deployed to:", cryptoBlessing.address);

    const transferCBTx = await cbToken.transfer(cryptoBlessing.address, BigInt(79 * 100000000));
    await transferCBTx.wait();

    let addBlessingTx = await cryptoBlessing.addBlessing("http://rdvru2kvi.hn-bkt.clouddn.com/gongxifacai.png", "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097", "gong xi fa cai", BigInt(1 * 10 ** 18), 1);
    await addBlessingTx.wait();

    addBlessingTx = await cryptoBlessing.addBlessing("http://rdvru2kvi.hn-bkt.clouddn.com/tuo.png", "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "脱，脱，脱!", BigInt(1 * 10 ** 18), 3);
    await addBlessingTx.wait();

    addBlessingTx = await cryptoBlessing.addBlessing("http://rdvru2kvi.hn-bkt.clouddn.com/notwar.png", "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", "make love, not war!", BigInt(9.9 * 10 ** 18), 2);
    await addBlessingTx.wait();

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
