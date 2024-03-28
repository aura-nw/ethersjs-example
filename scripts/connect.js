const fs = require('fs');
const { ethers } = require('hardhat');
const { NetworkUserConfig } = require('hardhat/types');

async function main() {
    const RPC_ENDPOINT = "https://evmos-testnet-jsonrpc.alkadeta.com/";
    const ABI_PATH = "./ABIs/WETH.json";
    const CONTRACT_ADDRESS = "0xE9cF9154212D862264E794b72B8aB4568Bb50813";
    const privateKey = fs.readFileSync('.secret').toString().trim();

    // Create an ethers provider connected to the RPC endpoint
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

    // Load the private key from the secret file and connect it to the provider
    const signer = new ethers.Wallet(privateKey, provider);

    // Load ABI of contract
    const ABI = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

    // Connect to the contract with the signer and the ABI
    const weth_contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // Query the contract for test
    const name = await weth_contract.name();
    console.log("WETH name: ", name);

    // Execute a transaction
    const tx = await weth_contract.approve("0xE9cF9154212D862264E794b72B8aB4568Bb50813", 1);
    console.log("Transaction hash: ", tx.hash);
}

main();