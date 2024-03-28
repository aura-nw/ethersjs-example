const fs = require('fs');
const { ethers } = require('hardhat');
const { NetworkUserConfig } = require('hardhat/types');

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

    // We need to approve the contract to transfer the NFT
    const NFT_ADDRESS = "0x2C023A22743526060578a3551c6Ab2E04DdFE459";

    /// @notice Fills the ask for a given NFT, transferring the ETH/ERC-20 to the seller and NFT to the buyer
    /// @param _tokenContract The address of the ERC-721 token
    /// @param _tokenId The ID of the ERC-721 token
    /// @param _fillCurrency The address of the ERC-20 token using to fill, or address(0) for ETH
    /// @param _fillAmount The amount to fill the ask
    /// @param _finder The address of the ask referrer
    const _tokenContract = NFT_ADDRESS;
    const _tokenId = 2;
    const _fillCurrency = ZERO_ADDRESS;
    const _fillAmount = ethers.parseEther("0.01");
    const _finder = signer.address;
    const tx = await contract.fillAsk(
        _tokenContract, 
        _tokenId, 
        _fillCurrency, 
        _fillAmount, 
        _finder,
        {value: ethers.parseEther("0.01")}
    );
    console.log("Creating ask transaction: ", tx.hash);
}

main();