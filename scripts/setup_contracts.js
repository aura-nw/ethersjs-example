const fs = require('fs');
const { ethers } = require('hardhat');
const { NetworkUserConfig } = require('hardhat/types');

/// @notice This feature belongs to the Protocol Fee Settings and must me called once before registering a module
/// @notice Initialize the Protocol Fee Settings
/// @param _minter The address that can mint new NFTs (expected ZoraModuleManager address)
async function initializeProtocolFeeSettings(minter, metadataa) {
    const RPC_ENDPOINT = "https://evmos-testnet-jsonrpc.alkadeta.com/";
    const ABI_PATH = "./ABIs/ProtocolFeeSettings.json";
    const CONTRACT_ADDRESS = "0x2A0f0A203F845716D47E0121E8d29c7cEC47f738";
    const privateKey = fs.readFileSync('.secret').toString().trim();

    // Create an ethers provider connected to the RPC endpoint
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

    // Load the private key from the secret file and connect it to the provider
    const signer = new ethers.Wallet(privateKey, provider);

    // Load ABI of contract
    const ABI = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

    // Connect to the contract with the signer and the ABI
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // Initialize the module
    const init = await contract.init(minter, metadataa);
    console.log("Initializing module transaction: ", init.hash);
}

/// @notice This feature belongs to the ModuleManager contract
/// @notice This feature must be called once after the deployment of the contract
async function registerModule(module) {
    const RPC_ENDPOINT = "https://evmos-testnet-jsonrpc.alkadeta.com/";
    const ABI_PATH = "./ABIs/ModuleManager.json";
    const CONTRACT_ADDRESS = "0x6779178Ba139A61890A0B05a15045dF2ED0ae2dd";
    const privateKey = fs.readFileSync('.secret').toString().trim();

    // Create an ethers provider connected to the RPC endpoint
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

    // Load the private key from the secret file and connect it to the provider
    const signer = new ethers.Wallet(privateKey, provider);

    // Load ABI of contract
    const ABI = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

    // Connect to the contract with the signer and the ABI
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // Register the module
    const tx = await contract.registerModule(module);
    console.log("Registering module transaction: ", tx.hash);
}

/// @notice This feature belongs to the ModuleManager contract, it's a requirement before creating an ask
/// @notice Allows a user to set the approval for a given module
/// @param _module The module to approve
/// @param _approved A boolean, whether or not to approve a module
async function approveModule(module, approved) {
    const RPC_ENDPOINT = "https://evmos-testnet-jsonrpc.alkadeta.com/";
    const ABI_PATH = "./ABIs/ModuleManager.json";
    const CONTRACT_ADDRESS = "0x6779178Ba139A61890A0B05a15045dF2ED0ae2dd";
    const privateKey = fs.readFileSync('.secret').toString().trim();

    // Create an ethers provider connected to the RPC endpoint
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

    // Load the private key from the secret file and connect it to the provider
    const signer = new ethers.Wallet(privateKey, provider);

    // Load ABI of contract
    const ABI = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

    // Connect to the contract with the signer and the ABI
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // Approve the module
    const tx = await contract.setApprovalForModule(module, approved);
    console.log("Approving module transaction: ", tx.hash);
}

async function main() {
    // Initialize the Protocol Fee Settings
    const ModuleManager = "0x6779178Ba139A61890A0B05a15045dF2ED0ae2dd";
    const metadata = "0x697291b3E74C63aAb6D358139B4CE3C6ec93b4ac";
    await initializeProtocolFeeSettings(ModuleManager, metadata);

    //Register the module
    await registerModule(CONTRACT_ADDRESS);

    // Before creating an ask, we need to approve the module
    await approveModule(CONTRACT_ADDRESS, true);
}

main();