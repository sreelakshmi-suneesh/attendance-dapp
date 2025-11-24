import { ethers } from "hardhat";

async function main() {
  const Attendance = await ethers.getContractFactory("Attendance");
  const attendance = await Attendance.deploy();

  await attendance.waitForDeployment();

  console.log("Contract deployed at:", await attendance.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
