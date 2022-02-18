
const hre = require("hardhat");

let owner;
let addr1;
let addr2;
let addr3;

async function main() {

  const EspanaMetod = await hre.ethers.getContractFactory("EspanaMetod");
  const em = await EspanaMetod.deploy();

  await em.deployed();

  console.log("EspanaMetod deployed to:", em.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
