require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
const settings = {
  optimizer: {
    enabled: true,
    runs: 200,
  },
  evmVersion: "istanbul"
}


module.exports = {
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
