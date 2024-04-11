RPC_URL="https://jsonrpc.serenity.aura.network"
echo "RPC: $RPC_URL"
PRIVATE_KEY="d00db29e7f6cc6f0d111ab8aa5cebbe973706a02c9abc822c12345fd6595f6b8c"
REGISTRAR="0x558d26dD7a892Fc034f1Dc706E2D1f60Ad925Cf5"
echo "Registrar: $REGISTRAR"
ZORAROYALTYENGINEV1="0x8E4B6D854cB9acaD86435D1E396017e1dAb3220A"
ZORAROYALTYREGISTRY="0x727A80Eb575c2d0397a594De24bAb97165D12705"
MYTOKEN="0xf6ae0b983Fb3F1A694D88EF97c561D27F4C367c6"
METADATA="0x7007351d0A129eE84622B7Be4c3c12acd592943E"

echo "Deploying ZoraProtocolFeeSettings..."
FEE_SETTINGS_DEPLOY_OUTPUT=$(forge create --rpc-url $RPC_URL --private-key $PRIVATE_KEY ZoraProtocolFeeSettings)
FEE_SETTINGS_ADDR=$(echo $FEE_SETTINGS_DEPLOY_OUTPUT | rev | cut -d " " -f4 | rev)

echo "Deploying ZoraModuleManager..."
MODULE_MANAGER_DEPLOY_OUTPUT=$(forge create --rpc-url $RPC_URL --private-key $PRIVATE_KEY ZoraModuleManager --constructor-args "$REGISTRAR" "$FEE_SETTINGS_ADDR")
MODULE_MANAGER_ADDR=$(echo $MODULE_MANAGER_DEPLOY_OUTPUT | rev | cut -d " " -f4 | rev)

echo "Deploying ERC20TransferHelper..."
ERC20_TRANSFER_HELPER_DEPLOY_OUTPUT=$(forge create --rpc-url $RPC_URL --private-key $PRIVATE_KEY ERC20TransferHelper --constructor-args "$MODULE_MANAGER_ADDR")
ERC20_TRANSFER_HELPER_ADDR=$(echo $ERC20_TRANSFER_HELPER_DEPLOY_OUTPUT | rev | cut -d " " -f4 | rev)

echo "Deploying ERC721TransferHelper..."
ERC721_TRANSFER_HELPER_DEPLOY_OUTPUT=$(forge create --rpc-url $RPC_URL --private-key $PRIVATE_KEY ERC721TransferHelper --constructor-args "$MODULE_MANAGER_ADDR")
ERC721_TRANSFER_HELPER_ADDR=$(echo $ERC721_TRANSFER_HELPER_DEPLOY_OUTPUT | rev | cut -d " " -f4 | rev)

echo "Deploying WETH..."
WETH_DEPLOY_OUTPUT=$(forge create --rpc-url $RPC_URL --private-key $PRIVATE_KEY WETH)
WETH_ADDR=$(echo $WETH_DEPLOY_OUTPUT | rev | cut -d " " -f4 | rev)

echo "Deploying AsksV1_1..."
ASKS_DEPLOY_OUTPUT=$(forge create --rpc-url $RPC_URL --private-key $PRIVATE_KEY AsksV1_1 --constructor-args "$ERC20_TRANSFER_HELPER_ADDR" "$ERC721_TRANSFER_HELPER_ADDR" "$ZORAROYALTYENGINEV1" "$FEE_SETTINGS_ADDR" "$WETH_ADDR")
ASKS_ADDR=$(echo $ASKS_DEPLOY_OUTPUT | rev | cut -d " " -f4 | rev)

echo "Result:"
echo "const ZoraModuleManager = \"$MODULE_MANAGER_ADDR\";"
echo "const RoyaltyRegistry = \"$ZORAROYALTYREGISTRY\";"
echo "const ERC20TransferHelper = \"$ERC20_TRANSFER_HELPER_ADDR\";"
echo "const ERC721TransferHelper = \"$ERC721_TRANSFER_HELPER_ADDR\";"
echo "const RoyaltyEngineV1 = \"$ZORAROYALTYENGINEV1\";"
echo "const ZoraProtocolFeeSettings = \"$FEE_SETTINGS_ADDR\";"
echo "const WETH = \"$WETH_ADDR\";"
echo "const AsksV1_1 = \"$ASKS_ADDR\";"
echo "const MyToken = \"$MYTOKEN\";"
echo "const Metadata = \"$METADATA\";"