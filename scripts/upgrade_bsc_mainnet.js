/* global BigInt */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

  const BUSD_ADDRESS = '0xe9e7cea3dedca5984780bafc599bd69add087d56';

  const CBT_ADDRESS = '0x218B53FBCc4b128e2FF289d78079174d7E35CF4C'

  const CBNFT_ADDRESS = '0x01ee790155677AAAE3060a09e32491d4C716f908'


  const CryptoBlessing = await hre.ethers.getContractFactory("CryptoBlessing");
  const preCryptoBlessing = await CryptoBlessing.attach("0xc0CE659216A0EE7B0a9c309BdE2FB42376aD215a");

  let newcryptoBlessing = await CryptoBlessing.deploy(BUSD_ADDRESS, CBT_ADDRESS, CBNFT_ADDRESS);
  await newcryptoBlessing.deployed();

  // pause old contract
  const pauseTx = await preCryptoBlessing.pause();
  await pauseTx.wait()

  // upgrade
  const upgradeTx = await preCryptoBlessing.upgradeToV2(newcryptoBlessing.address);
  await upgradeTx.wait()
  console.log("CryptoBlessing core contract upgraded to:", newcryptoBlessing.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
