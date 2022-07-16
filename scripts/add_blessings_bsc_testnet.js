/* global BigInt */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

    const CryptoBlessing = await hre.ethers.getContractFactory("CryptoBlessing");
    const cryptoBlessing = await CryptoBlessing.attach("0x6725102Be69B1F14b61D7cC72036CE036E763a30");

    let addBlessingTx = await cryptoBlessing.batchUpdateBlessing(
      ["fortune.gif","soul.gif","gongxifacai.gif"],
      [{"price":BigInt(100000000000000000),"owner":"0xC868FdF4113C4FD16F0A734ce40952942E808374","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0xaF894D18cc4652C90dc024235975a43e8f737087","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x8b2A30e4870B85c87B72a165910F932C87aEd856","deleted":0,"taxRate":10}]
    );
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
