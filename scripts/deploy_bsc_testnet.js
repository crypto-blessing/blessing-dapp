/* global BigInt */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

    const BUSD_ADDRESS = '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7';

    const CBToken = await hre.ethers.getContractFactory("CryptoBlessingToken");
    let cbToken = await CBToken.deploy();
    await cbToken.deployed();
    console.log("CryptoBlessing token deployed to:", cbToken.address);

    const CryptoBlessingNFT = await hre.ethers.getContractFactory("CryptoBlessingNFT");
    let cbNFT = await CryptoBlessingNFT.deploy();
    await cbNFT.deployed();
    console.log("CryptoBlessing NFT deployed to:", cbNFT.address);

    const CryptoBlessing = await hre.ethers.getContractFactory("CryptoBlessing");
    let cryptoBlessing = await CryptoBlessing.deploy(BUSD_ADDRESS, cbToken.address, cbNFT.address);
    await cryptoBlessing.deployed();
    console.log("CryptoBlessing core contract deployed to:", cryptoBlessing.address);

    const transferCBTx = await cbToken.transfer(cryptoBlessing.address, BigInt(9 * 100000000));
    await transferCBTx.wait();

    // transfer the owner of CBNFT to the owner of CryptoBlessing.
    await cbNFT.transferOwnership(cryptoBlessing.address);

    let addBlessingTx = await cryptoBlessing.addBlessing("http://rdvru2kvi.hn-bkt.clouddn.com/gongxifacai.png", "0x8b2A30e4870B85c87B72a165910F932C87aEd856", "gong xi fa cai#In every Chinese New Year, the greetings among Chinese", BigInt(0.1 * 10 ** 18), 1, 10);
    await addBlessingTx.wait();

    // addBlessingTx = await cryptoBlessing.addBlessing("http://rdvru2kvi.hn-bkt.clouddn.com/tuo.png", "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "脱，脱，脱!#The ultimate home for engineers", BigInt(1 * 10 ** 18), 3);
    // await addBlessingTx.wait();

    // addBlessingTx = await cryptoBlessing.addBlessing("http://rdvru2kvi.hn-bkt.clouddn.com/notwar.png", "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", "make love, not war!#We need to fill the world with love", BigInt(9.9 * 10 ** 18), 2);
    // await addBlessingTx.wait();

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
