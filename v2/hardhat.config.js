require("@nomicfoundation/hardhat-toolbox");

const INFURA_API_KEY = vars.get("INFURA_API_KEY");
const SEPOLIA_DEV_PK = vars.get("SEPOLIA_DEV_PK");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

/** @type import('hardhat/config').HardhatUserConfig */
const settings = {
  optimizer: {
    enabled: true,
    runs: 200,
  },
  evmVersion: "istanbul"
}


module.exports = {
  networks: {
    local: {
      url: "http://127.0.0.1:8545/",
    } ,
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_DEV_PK]
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    },
  },

  solidity: {
    compilers: [
      // For uniswap-v2-core
      {
        version: "0.5.16",
        settings
      },
      // For uniswap-v2-periphery
      {
        version: "0.6.6",
        settings
      },
      {
        version: "0.8.0",
        settings
      }
    ],
    // 针对下面合约无法编译通过
    overrides: {
      "@uniswap/lib/contracts/libraries/FullMath.sol": {
        version: "0.6.6",
        settings
      },
      "@uniswap/lib/contracts/libraries/BitMath.sol": {
        version: "0.6.6",
        settings
      },
      "@uniswap/lib/contracts/libraries/FixedPoint.sol": {
        version: "0.6.6",
        settings
      },
      "contracts/uniswap-v2-periphery/contracts/libraries/UniswapV2OracleLibrary.sol": {
        version: "0.6.6",
        settings
      },
    }
  },
  
};
