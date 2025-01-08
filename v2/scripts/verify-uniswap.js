const hre = require("hardhat");
const {ethers} = require("hardhat");
const {getUniswapAddresses} = require("./utils")

async function verifyUniswap() {
  const [deployer] = await ethers.getSigners();
  const items = getUniswapAddresses()[hre.network.name];

  // WETH
  await hre.run("verify:verify", {
    address: items.WETH,
    constructorArguments: [],
  });

  // UniswapV2Factory
  await hre.run("verify:verify", {
    address: items.UniswapV2Factory,
    constructorArguments: [deployer.address],
  });

  // UniswapV2Router01
  await hre.run("verify:verify", {
    address: items.UniswapV2Router01,
    constructorArguments: [items.UniswapV2Factory, items.WETH],
  });

  // UniswapV2Router02
  await hre.run("verify:verify", {
    address: items.UniswapV2Router02,
    constructorArguments: [items.UniswapV2Factory, items.WETH],
  });

  // Multicall
  await hre.run("verify:verify", {
    address: items.Multicall,
    constructorArguments: [],
  });

}

verifyUniswap();