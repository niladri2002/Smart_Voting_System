
const hre = require("hardhat");

async function main() {
 

  const Voting =await hre.ethers.getContractFactory("VotingSystem");
  const Voting_=await Voting.deploy(["Sushanta","Niladri","Shubham","Amit"]);
  await Voting_.deployed();
  console.log(
    `Contract address : ${Voting_.address}`
  );
}

  

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
