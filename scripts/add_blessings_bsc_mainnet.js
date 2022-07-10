/* global BigInt */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

    const CryptoBlessing = await hre.ethers.getContractFactory("CryptoBlessing");
    const cryptoBlessing = await CryptoBlessing.attach("0x2B595C0F6350059988FdEF52f1995099F0382032");

    // await cryptoBlessing.addBlessing("gongxifacai.gif", "0x73c452f178338aa4e34E77C130F9CA0F33C01504", "Lucky Tiger!#Hope everyone is lucky💰 lucky💰 lucky💰 in 2022!", BigInt(0.1 * 10 ** 18), 1, 10);

    // await cryptoBlessing.addBlessing("soul.gif", "0xE766D167b1332E6E2f0C0615FAC852A82eC2E351", "Soal for you!#Bless your soul, my friend.", BigInt(0.1 * 10 ** 18), 1, 10);

    await cryptoBlessing.addBlessing("fortune.gif", "0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907", "Give you fortune!#Fortune is the goddess of luck.", BigInt(0.1 * 10 ** 18), 1, 10);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
