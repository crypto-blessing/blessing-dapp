/* global BigInt */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

    const CryptoBlessing = await hre.ethers.getContractFactory("CryptoBlessing");
    const cryptoBlessing = await CryptoBlessing.attach("0x38bbd40b41E95F6Dc7B27F3A727C8A1455fAa623");

    // let addBlessingTx = await cryptoBlessing.addBlessing("gongxifacai.gif", "0x8b2A30e4870B85c87B72a165910F932C87aEd856", "Lucky Tiger!#Hope everyone is lucky💰 lucky💰 lucky💰 in 2022!", BigInt(0.1 * 10 ** 18), 1, 10);
    // await addBlessingTx.wait();

    // let addBlessingTx2 = await cryptoBlessing.addBlessing("soul.gif", "0xaF894D18cc4652C90dc024235975a43e8f737087", "Soal for you!#Bless your soul, my friend.", BigInt(0.1 * 10 ** 18), 1, 10);
    // await addBlessingTx2.wait();

    let addBlessingTx3 = await cryptoBlessing.addBlessing("fortune.gif", "0xC868FdF4113C4FD16F0A734ce40952942E808374", "Give you fortune!#Fortune is the goddess of luck.", BigInt(0.1 * 10 ** 18), 1, 10);
    await addBlessingTx3.wait();

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
