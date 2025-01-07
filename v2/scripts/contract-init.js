const hre = require("hardhat");
const {saveUniswapAddress} = require("./utils")
const { keccak256 } = require("@ethersproject/solidity");
const UniswapV2PairJson = require("../artifacts/contracts/uniswap-v2-core/contracts/UniswapV2Pair.sol/UniswapV2Pair.json");

const path = require("path");
const fs = require("fs");

function init() {
    const COMPUTED_INIT_CODE_HASH = keccak256(['bytes'], [UniswapV2PairJson.bytecode]);
    const INIT_CODE_HASH = COMPUTED_INIT_CODE_HASH.substring(2);

    let filePath = path.resolve(__dirname, "../contracts/uniswap-v2-periphery/contracts/libraries/UniswapV2Library.sol");

    // 修改 UniswapV2Library 中 init code hash
    // fs.writeFileSync(filePath, fs.readFileSync(filePath).toString().replace("2fdb731c181a20cd8de125b7e2df92b47368c350b4f167955363b50cbebec883", COMPUTED_INIT_CODE_HASH.substring(2)));
    fs.writeFileSync(
      filePath, 
      fs.readFileSync(filePath).toString().replace(
        /.*\/\/\s*init code hash/, `                hex'${INIT_CODE_HASH}' // init code hash`
      )
    );
    // 注意哪些需要加 0x，哪些不需要加
    saveUniswapAddress(hre.network.name, 'INIT_CODE_HASH', COMPUTED_INIT_CODE_HASH);
    console.log("INIT_CODE_HASH: ", COMPUTED_INIT_CODE_HASH);
}

init();