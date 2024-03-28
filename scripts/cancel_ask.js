const fs = require('fs');
const { ethers } = require('hardhat');
const { NetworkUserConfig } = require('hardhat/types');

async function main() {
    const RPC_ENDPOINT = "https://evmos-testnet-jsonrpc.alkadeta.com/";
    const ABI_PATH = "./ABIs/AsksV1_1.json";
    const CONTRACT_ADDRESS = "0xE49a78aafcAFA57a7795B42A68b7b02D7f481baC";
    const privateKey = fs.readFileSync('.secret').toString().trim();
    const NFT_ADDRESS = "0x2C023A22743526060578a3551c6Ab2E04DdFE459";

    // Create an ethers provider connected to the RPC endpoint
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

    // Load the private key from the secret file and connect it to the provider
    const signer = new ethers.Wallet(privateKey, provider);

    // Load ABI of contract
    const ABI = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

    // Connect to the contract with the signer and the ABI
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    /// @notice Cancels the ask for a given NFT
    /// @param _tokenContract The address of the ERC-721 token
    /// @param _tokenId The ID of the ERC-721 token
    const _tokenContract = NFT_ADDRESS;
    const _tokenId = 1;
    const tx = await contract.cancelAsk(
        _tokenContract, 
        _tokenId
    );
    console.log("Cancel ask transaction: ", tx.hash);
}

main();