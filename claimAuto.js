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

    console.log('🔎 Checking contract state...');

    const isOpen = await contract.claimIsOpen();
    if (!isOpen) {
      console.log('⛔ Claim is not open.');
      return;
    }

    const claimStart = await contract.claimStart();
    const now = Math.floor(Date.now() / 1000);
    if (claimStart > now) {
      console.log('⏳ Claim has not started yet.');
      return;
    }

    const alreadyClaimed = await contract.hasClaimed(wallet.address);
    if (alreadyClaimed) {
      console.log('✅ You have already claimed.');
      return;
    }

    console.log('🚀 Claiming tokens...');
    const tx = await contract.claim(wallet.address);
    console.log('📤 Transaction sent. Waiting for confirmation...');

    const receipt = await tx.wait();
    console.log('🎉 Claim successful! TxHash:', receipt.transactionHash);

  } catch (err) {
    console.error('❌ Error:', err.message || err);
    rl.close();
  }
})();
