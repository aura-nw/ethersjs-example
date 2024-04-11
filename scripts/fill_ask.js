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
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    const ABI_PATH = "./ABIs/AsksV1_1.json";
    const privateKey = fs.readFileSync('.secret').toString().trim();
    const ERC721TRANSFERHELPER = "0x7a56178610624943aeDF11Ce7b7C9d991aFBCc36";

    // Create an ethers provider connected to the RPC endpoint
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

    // Load the private key from the secret file and connect it to the provider
    const signer = new ethers.Wallet(privateKey, provider);

    // Load ABI of contract
    const ABI = JSON.parse(fs.readFileSync(ABI_PATH)).abi;

    // Connect to the contract with the signer and the ABI
    const contract = new ethers.Contract(AsksV1_1, ABI, signer);

    /// @notice Fills the ask for a given NFT, transferring the ETH/ERC-20 to the seller and NFT to the buyer
    /// @param _tokenContract The address of the ERC-721 token
    /// @param _tokenId The ID of the ERC-721 token
    /// @param _fillCurrency The address of the ERC-20 token using to fill, or address(0) for ETH
    /// @param _fillAmount The amount to fill the ask
    /// @param _finder The address of the ask referrer
    const _tokenContract = MyToken;
    const _tokenId = 1;
    const _fillCurrency = ZERO_ADDRESS;   // This is address of native token
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