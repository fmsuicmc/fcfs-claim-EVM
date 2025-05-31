const { ethers } = require('ethers');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

(async () => {
  try {
    const privateKey = await ask('🔑 Enter your private key: ');
    const providerUrl = await ask('🌐 Enter RPC provider URL: ');
    const contractAddress = await ask('🏗 Enter contract address: ');
    const abiRaw = await ask('📋 Paste ABI (single-line JSON): ');

    rl.close();

    const abi = JSON.parse(abiRaw);
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    console.log("🤖 Claim bot started. Checking every 2 seconds...");

    let lastMaxFee = 0n; // to avoid underpriced txs

    const loop = async () => {
      try {
        const isOpen = await contract.claimIsOpen();
        if (!isOpen) {
          console.log("⏳ Claim is not open yet. Retrying...");
          return;
        }

        const claimStart = await contract.claimStart();
        const now = Math.floor(Date.now() / 1000);
        if (claimStart > now) {
          console.log(`🕒 Claim starts at ${claimStart}, current time is ${now}. Retrying...`);
          return;
        }

        const alreadyClaimed = await contract.hasClaimed(wallet.address);
        if (alreadyClaimed) {
          console.log("✅ You have already claimed. Exiting bot.");
          process.exit(0);
        }

        console.log("🚀 Claiming tokens...");

        const feeData = await provider.getFeeData();
        let maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? 2n * 10n ** 9n;
        let maxFeePerGas = feeData.maxFeePerGas ?? 20n * 10n ** 9n;

        // Increase to avoid underpriced tx
        if (lastMaxFee > 0n) {
          maxFeePerGas = lastMaxFee * 112n / 100n; // +12%
          maxPriorityFeePerGas = maxPriorityFeePerGas * 112n / 100n;
        }
        lastMaxFee = maxFeePerGas;

        const nonce = await provider.getTransactionCount(wallet.address, 'latest');

        const tx = await contract.claim(wallet.address, {
          gasLimit: 250000n,
          maxPriorityFeePerGas,
          maxFeePerGas,
          nonce
        });

        console.log("📤 Transaction sent. Waiting for confirmation...");
        const receipt = await tx.wait();
        console.log("🎉 Claim successful! TxHash:", receipt.hash);
        process.exit(0);

      } catch (err) {
        console.error("❌ Error in loop:", err.message || err);
      }
    };

    setInterval(loop, 2000);
    await loop();

  } catch (err) {
    console.error('❌ Initialization error:', err.message || err);
    rl.close();
  }
})();
