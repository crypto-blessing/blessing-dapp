/* global BigInt */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

  const BUSD_ADDRESS = '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7';

  const CBT_ADDRESS = '0xd714e21932BAE2aF5F88793924DCdA76B072fBCC'

  const CBNFT_ADDRESS = '0xcf1e0102e08517207D3bb91EcB0a1a073EdFD410'


  const CryptoBlessing = await hre.ethers.getContractFactory("CryptoBlessing");
  const preCryptoBlessing = await CryptoBlessing.attach("0x79f6D9076D24EeD88D3711eaBF8Ed67C1F82dAF7");

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
