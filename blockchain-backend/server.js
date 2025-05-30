// backend/server.js
require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const MEMOXToken = require("./MEMOXToken.json");

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const memox = new ethers.Contract(process.env.MEMOX_ADDRESS, MEMOXToken.abi, wallet);

app.post("/distribute-memox", async (req, res) => {
  const { toAddress } = req.body;
  if (!ethers.isAddress(toAddress)) {
    return res.status(400).json({ success: false, message: "Invalid address" });
  }

  try {
    const tx = await memox.transfer(toAddress, ethers.parseUnits("5", 18));
    await tx.wait();
    console.log(`✅ Transferred 5 MEMOX to ${toAddress}`);
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error("Transfer failed:", err);
    res.status(500).json({ success: false, message: "Transfer failed" });
  }
});

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
  });
  
app.listen(PORT, () => {
  console.log(`🚀 MEMOX Backend running at http://localhost:${PORT}`);
});
