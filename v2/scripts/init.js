const { keccak256 } = require("@ethersproject/solidity");
const UniswapV2PairJson = require("../artifacts/contracts/uniswap-v2-core/contracts/UniswapV2Pair.sol/UniswapV2Pair.json");

const path = require("path");
const fs = require("fs");

function init() {
    const COMPUTED_INIT_CODE_HASH = keccak256(['bytes'], [UniswapV2PairJson.bytecode]);

    // 
    // 原v2: d1cd04b18677a4336dd43b1929a5141cd97c9a517ebd4891e043bdeae9a3fb31
    // new: 79681bc74104e3832134fbdbf4e4da393567d488beea1ff08eaad502457ed2c6
    console.log("[CHECK] init code in UniswapV2Library.sol : " + COMPUTED_INIT_CODE_HASH);
    let libPath = path.resolve(__dirname, "../contracts/uniswap-v2-periphery/contracts/libraries/UniswapV2Library.sol");
    // 修改 UniswapV2Library 中 init code hash
    fs.writeFileSync(libPath, fs.readFileSync(libPath).toString().replace("2fdb731c181a20cd8de125b7e2df92b47368c350b4f167955363b50cbebec883", COMPUTED_INIT_CODE_HASH.substring(2)));
    console.log(COMPUTED_INIT_CODE_HASH.substring(2));
}

init();