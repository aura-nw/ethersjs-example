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

/// @notice This feature belongs to the Protocol Fee Settings and must me called once before registering a module
/// @notice Initialize the Protocol Fee Settings
/// @param _minter The address that can mint new NFTs (expected ZoraModuleManager address)
async function initializeProtocolFeeSettings(minter, metadataa) {
    const ABI_PATH = "./ABIs/ProtocolFeeSettings.json";
    const privateKey = fs.readFileSync('.secret').toString().trim();

    // Create an ethers provider connected to the RPC endpoint
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

    // Load the private key from the secret file and connect it to the provider
    const signer = new ethers.Wallet(privateKey, provider);

    // Load ABI of contract
    const ABI = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

    // Connect to the contract with the signer and the ABI
    const contract = new ethers.Contract(ZoraProtocolFeeSettings, ABI, signer);

    // Initialize the module
    const init = await contract.init(minter, metadataa);
    console.log("Initializing module transaction: ", init.hash);
}

/// @notice This feature belongs to the ModuleManager contract
/// @notice This feature must be called once after the deployment of the contract
async function registerModule(module) {
    const ABI_PATH = "./ABIs/ModuleManager.json";
    const privateKey = fs.readFileSync('.secret').toString().trim();

    // Create an ethers provider connected to the RPC endpoint
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

    // Load the private key from the secret file and connect it to the provider
    const signer = new ethers.Wallet(privateKey, provider);

    // Load ABI of contract
    const ABI = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

    // Connect to the contract with the signer and the ABI
    const contract = new ethers.Contract(ZoraModuleManager, ABI, signer);

    // Register the module
    const tx = await contract.registerModule(module);
    console.log("Registering module transaction: ", tx.hash);
}

/// @notice This feature belongs to the ModuleManager contract, it's a requirement before creating an ask
/// @notice Allows a user to set the approval for a given module
/// @param _module The module to approve
/// @param _approved A boolean, whether or not to approve a module
async function approveModule(module, approved) {
    const ABI_PATH = "./ABIs/ModuleManager.json";
    const privateKey = fs.readFileSync('.secret').toString().trim();

    // Create an ethers provider connected to the RPC endpoint
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

    // Load the private key from the secret file and connect it to the provider
    const signer = new ethers.Wallet(privateKey, provider);

    // Load ABI of contract
    const ABI = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

    // Connect to the contract with the signer and the ABI
    const contract = new ethers.Contract(ZoraModuleManager, ABI, signer);

    // Approve the module
    const tx = await contract.setApprovalForModule(module, approved);
    console.log("Approving module transaction: ", tx.hash);
}

async function main() {
    // Initialize the Protocol Fee Settings
    await initializeProtocolFeeSettings(ZoraModuleManager, Metadata);

    // Register the module ask
    await registerModule(AsksV1_1);

    // Register the module ERC721TransferHelper
    await registerModule(ERC721TransferHelper);
    
    // Register the module ERC20TransferHelper
    await registerModule(ERC20TransferHelper);

    // Register the module RoyaltyRegistry
    await registerModule(RoyaltyRegistry);

    // Register the module RoyaltyEngineV1
    await registerModule(RoyaltyEngineV1);

    // Register the module ZoraProtocolFeeSettings
    await registerModule(ZoraProtocolFeeSettings);

    // // Before creating an ask, we need to approve the module
    // await approveModule(AsksV1_1, true);
}

main();