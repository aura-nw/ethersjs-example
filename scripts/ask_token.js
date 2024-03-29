const fs = require('fs');
const { ethers } = require('hardhat');
const { NetworkUserConfig } = require('hardhat/types');

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

async function approveNFT(contract, tokenContract, approved) {
    const RPC_ENDPOINT = "https://evmos-testnet-jsonrpc.alkadeta.com/";
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

async function main() {
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    const RPC_ENDPOINT = "https://evmos-testnet-jsonrpc.alkadeta.com/";
    const ABI_PATH = "./ABIs/AsksV1_1.json";
    const CONTRACT_ADDRESS = "0xE49a78aafcAFA57a7795B42A68b7b02D7f481baC";
    const privateKey = fs.readFileSync('.secret').toString().trim();
    const ERC721TRANSFERHELPER = "0x7a56178610624943aeDF11Ce7b7C9d991aFBCc36";

    // Create an ethers provider connected to the RPC endpoint
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

    // Load the private key from the secret file and connect it to the provider
    const signer = new ethers.Wallet(privateKey, provider);

    // Load ABI of contract
    const ABI = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

    // Connect to the contract with the signer and the ABI
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // Before creating an ask, we need to approve the module
    await approveModule(CONTRACT_ADDRESS, true);

    // We need to approve the contract to transfer the NFT
    const NFT_ADDRESS = "0x200b01b3a8882697b44bD401c04bF2Fc6eA9A4bB";
    await approveNFT(ERC721TRANSFERHELPER, NFT_ADDRESS, true);

    /// @notice Creates the ask for the NFT with token id 1
    /// @param _tokenContract The address of the ERC-721 token to be sold
    /// @param _tokenId The ID of the ERC-721 token to be sold
    /// @param _askPrice The price to fill the ask
    /// @param _askCurrency The address of the ERC-20 token required to fill, or address(0) for ETH
    /// @param _sellerFundsRecipient The address to send funds once the ask is filled
    /// @param _findersFeeBps The bps of the ask price (post-royalties) to be sent to the referrer of the sale
    const _tokenContract = NFT_ADDRESS;
    const _tokenId = 2;
    const _askPrice = ethers.parseEther("0.01");
    const _askCurrency = ZERO_ADDRESS;
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