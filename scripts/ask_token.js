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

/// @notice This feature belongs to the ModuleManager contract, it's a requirement before creating an ask
/// @notice Allows a user to set the approval for a given module
/// @param _module The module to approve
/// @param _approved A boolean, whether or not to approve a module
async function approveModule(module, approved) {
    const RPC_ENDPOINT = "https://jsonrpc.serenity.aura.network";
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

async function approveNFT(contract, tokenContract, approved) {
    const RPC_ENDPOINT = "https://jsonrpc.serenity.aura.network";
    const ABI_PATH = "./ABIs/MyToken.json";
    const CONTRACT_ADDRESS = tokenContract;
    const privateKey = fs.readFileSync('.secret').toString().trim();

    // Create an ethers provider connected to the RPC endpoint
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

    // Load the private key from the secret file and connect it to the provider
    const signer = new ethers.Wallet(privateKey, provider);

    // Load ABI of contract
    const ABI = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

    // Connect to the contract with the signer and the ABI
    const nft_contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // Approve all the contract to transfer the NFT
    const tx = await nft_contract.setApprovalForAll(contract, approved);
    console.log("Approving transaction: ", tx.hash);

    // Check it opperator is approved
    const isApproved = await nft_contract.isApprovedForAll(signer.address, contract);
    console.log("Is approved: ", isApproved);
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

async function main() {
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    const ABI_PATH = "./ABIs/AsksV1_1.json";
    const privateKey = fs.readFileSync('.secret').toString().trim();

    // Create an ethers provider connected to the RPC endpoint
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

    // Load the private key from the secret file and connect it to the provider
    const signer = new ethers.Wallet(privateKey, provider);

    // Load ABI of contract
    const ABI = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

    // Connect to the contract with the signer and the ABI
    const contract = new ethers.Contract(AsksV1_1, ABI, signer);

    // Before creating an ask, we need to approve the module
    await approveModule(AsksV1_1, true);

    // We need to approve the contract to transfer the NFT
    await approveNFT(ERC721TransferHelper, MyToken, true);

    // sleep for 5 seconds
    await new Promise(r => setTimeout(r, 5000));

    /// @notice Creates the ask for the NFT with token id 1
    /// @param _tokenContract The address of the ERC-721 token to be sold
    /// @param _tokenId The ID of the ERC-721 token to be sold
    /// @param _askPrice The price to fill the ask
    /// @param _askCurrency The address of the ERC-20 token required to fill, or address(0) for ETH
    /// @param _sellerFundsRecipient The address to send funds once the ask is filled
    /// @param _findersFeeBps The bps of the ask price (post-royalties) to be sent to the referrer of the sale
    const _tokenContract = MyToken;
    const _tokenId = 1;
    const _askPrice = ethers.parseEther("0.01");
    const _askCurrency = ZERO_ADDRESS;  // This is address of native token
    const _sellerFundsRecipient = signer.address;
    const _findersFeeBps = 0;
    const tx = await contract.createAsk(
        _tokenContract, 
        _tokenId, 
        _askPrice, 
        _askCurrency, 
        _sellerFundsRecipient, 
        _findersFeeBps
    );
    console.log("Creating ask transaction: ", tx.hash);
}

main();