const fs = require('fs');
const { ethers } = require('hardhat');
const { NetworkUserConfig } = require('hardhat/types');

async function main() {
    const RPC_ENDPOINT = "https://evmos-testnet-jsonrpc.alkadeta.com/";
    const ABI_PATH = "./ABIs/MyToken.json";
    const CONTRACT_ADDRESS = "0x200b01b3a8882697b44bD401c04bF2Fc6eA9A4bB";
    const privateKey = fs.readFileSync('.secret').toString().trim();

    // Create an ethers provider connected to the RPC endpoint
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

    // Load the private key from the secret file and connect it to the provider
    const signer = new ethers.Wallet(privateKey, provider);

    // Load ABI of contract
    const ABI = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

    // Connect to the contract with the signer and the ABI
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // Query the contract for test
    const name = await contract.name();
    console.log("Contract name: ", name);

    console.log("Deployer address: ", signer.address);

    // Mint 1 token to deployer
    const tx = await contract.safeMint(signer.address);
    console.log("Minting transaction 1: ", tx.hash);

    // // Mint 1 more token to deployer
    // const tx2 = await contract.safeMint(signer.address);
    // console.log("Minting transaction 2: ", tx2.hash);

    // // Mint 1 more token to deployer
    // const tx3 = await contract.safeMint(signer.address);
    // console.log("Minting transaction 3: ", tx3.hash);

    // Query token uri
    const tokenURI = await contract.tokenURI(0);
    console.log("Token URI: ", tokenURI);
    const tokenURI2 = await contract.tokenURI(1);
    console.log("Token URI: ", tokenURI2);
    const tokenURI3 = await contract.tokenURI(2);
    console.log("Token URI: ", tokenURI3);
}

main();