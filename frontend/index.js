import { ethers } from "./node_modules/ethers/dist/ethers.min.js";
import { contractAddress } from "./config.js";
import { contractABI } from "./abi.js";

// Connect Contract
async function connectContract() {
  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(contractAddress, contractABI, signer);
}

// Pretty pop-up alert
function notify(message) {
  const box = document.getElementById("output");
  box.innerText = message;
  box.style.background = "#d4edda";
  box.style.color = "#155724";
}

// Error pop-up
function notifyError(message) {
  const box = document.getElementById("output");
  box.innerText = message;
  box.style.background = "#f8d7da";
  box.style.color = "#721c24";
}

// Connect Wallet Button
document.getElementById("connectBtn").onclick = async () => {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    notify("Wallet connected successfully!");
  } catch (err) {
    notifyError("Wallet connection failed");
  }
};

// Mark Attendance Button
document.getElementById("markBtn").onclick = async () => {
  try {
    const contract = await connectContract();
    const name = document.getElementById("nameInput").value;

    if (!name) return notifyError("Enter your name before marking!");

    const tx = await contract.markAttendance(name);
    await tx.wait();

    notify(`Attendance marked successfully for: ${name}`);
  } catch (err) {
    if (err.message.includes("already marked")) {
      notifyError("You have already marked attendance!");
    } else {
      notifyError("Error marking attendance");
    }
  }
};

// View Attendance Button
document.getElementById("viewBtn").onclick = async () => {
  try {
    const contract = await connectContract();

    const user = window.ethereum.selectedAddress;

    const hasMarked = await contract.hasMarkedAttendance(user);
    const total = await contract.totalAttendance();

    if (hasMarked) {
      notify(`You HAVE marked attendance.\n\nTotal attendance today: ${total}`);
    } else {
      notify("You have NOT marked attendance yet.");
    }
  } catch (err) {
    notifyError("Error fetching attendance");
    console.error(err);
  }
};
