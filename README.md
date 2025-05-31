
# 🪙 FCFS Token Claim (EVM Compatible)

A fully automated Node.js CLI tool to claim tokens from a smart contract on any EVM-compatible blockchain using `ethers.js`.

Developed and maintained by **fmsuicmc**.

---

## 🚀 Features

- 🔄 Fully automated claim flow (no menus or manual navigation)
- 📋 Accepts ABI directly as a single-line JSON input
- ✅ Validates wallet, claim period, and previous claims
- ⚡ Fast and lightweight — runs instantly with no config files

---

## 🛠 Requirements

- Node.js (v16 or newer)
- NPM (comes with Node.js)

---

## 📦 Installation

```bash
git clone https://github.com/fmsuicmc/fcfs-claim-EVM.git
cd fcfs-claim-EVM
npm install ethers
```

---

## ▶️ How to Use

Simply run:

```bash
node claimAuto.js
```

You will be prompted to input:

1. 🔐 Your **private key**
2. 🌐 The **RPC provider URL** (e.g. from Infura, Alchemy)
3. 🏗 The **smart contract address**
4. 📋 The **contract ABI** (as single-line JSON)

---

## 🔍 Example ABI Input

Here is a minimal example of a compatible ABI:

```json
[{"inputs":[],"name":"claimIsOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimStart","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"claimer","type":"address"}],"name":"hasClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"claimer","type":"address"}],"name":"claim","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
```

You can get the full ABI from [Etherscan](https://etherscan.io/) if the contract is verified.

---

## 🔒 Security Notes

- 🚫 **Never** share your private key with anyone.
- 🧪 Always test on **testnet** first before using mainnet.
- 🧾 Only use verified contracts you trust.
- 🧠 You are solely responsible for your funds and keys.

---

## 📄 License

MIT License © 2025  
Created and maintained by [fmsuicmc](https://github.com/fmsuicmc)

You are free to use, modify, and distribute this tool under the terms of the MIT License. Attribution is appreciated.

---

## 🤝 Contributions

Pull requests, issues, and suggestions are welcome!
