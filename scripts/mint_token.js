const fs = require('fs');
const { ethers } = require('hardhat');
const { NetworkUserConfig } = require('hardhat/types');

const ZoraModuleManager = "0x072e1b72e39aa018de54091CF6625dBDf227b3B4";
const RoyaltyRegistry = "0x727A80Eb575c2d0397a594De24bAb97165D12705";
const ERC20TransferHelper = "0x71B65250BF5ED67321D318A3a7dB46c7616fa154";
const ERC721TransferHelper = "0x6944F3183F54757a8deaC2aEb9d4D3d64cb985f1";
const RoyaltyEngineV1 = "0x8E4B6D854cB9acaD86435D1E396017e1dAb3220A";
const ZoraProtocolFeeSettings = "0xCFE3456274bE608f2aBf92d0f7d952712D4F3275";
const WETH = "0x5Db8A2543e7e3Add18389C5ED63757A46A4848C1";
const AsksV1_1 = "0xc3A73d1b9870FEdDb782237aa8AF50167a5016A9";
const MyToken = "0xf6ae0b983Fb3F1A694D88EF97c561D27F4C367c6";
const Metadata = "0x7007351d0A129eE84622B7Be4c3c12acd592943E";

const RPC_ENDPOINT = "https://jsonrpc.serenity.aura.network";

async function main() {
    const ABI_PATH = "./ABIs/MyToken.json";
    const privateKey = fs.readFileSync('.secret').toString().trim();

    // Create an ethers provider connected to the RPC endpoint
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

    // Load the private key from the secret file and connect it to the provider
    const signer = new ethers.Wallet(privateKey, provider);

    // Load ABI of contract
    const ABI = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

    // Connect to the contract with the signer and the ABI
    const contract = new ethers.Contract(MyToken, ABI, signer);

    // Query the contract for test
    const name = await contract.name();
    console.log("Contract name: ", name);

    console.log("Deployer address: ", signer.address);

    // Mint 1 token to deployer
    const tx = await contract.safeMint(signer.address);
    console.log("Minting transaction 1: ", tx.hash);

    // Mint 1 more token to deployer
    const tx2 = await contract.safeMint(signer.address);
    console.log("Minting transaction 2: ", tx2.hash);

    // Mint 1 more token to deployer
    const tx3 = await contract.safeMint(signer.address);
    console.log("Minting transaction 3: ", tx3.hash);

    // Query token uri
    const tokenURI = await contract.tokenURI(0);
    console.log("Token URI: ", tokenURI);
    const tokenURI2 = await contract.tokenURI(1);
    console.log("Token URI: ", tokenURI2);
    const tokenURI3 = await contract.tokenURI(2);
    console.log("Token URI: ", tokenURI3);
}

main();