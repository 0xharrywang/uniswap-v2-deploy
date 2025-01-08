const hre = require("hardhat");
const { ethers } = require("hardhat");
const {saveUniswapAddress} = require("./utils")

/*
* 部署 Uniswap
**/
async function deployUniswap() {
    const weth = await getWETH();
    // 部署 Uniswap 合约
    console.log(`${"-".repeat(32) + deployUniswap.name + "-".repeat(32)}`);
    // 部署 UniswapV2Factory
    const factory = await (await (await ethers.getContractFactory('UniswapV2Factory')).deploy((await ethers.getSigners())[0].address)).waitForDeployment();
    // 部署 UniswapV2Router02
    const router2 = await (await (await ethers.getContractFactory('UniswapV2Router02')).deploy(factory.target, weth.target)).waitForDeployment();
    // 部署 multicall
    const multicall = await (await (await ethers.getContractFactory('Multicall')).deploy()).waitForDeployment();

    console.log(`${"Factory deployed to : ".padStart(28)}${factory.target}`);
    console.log(`${"Router02 deployed to : ".padStart(28)}${router2.target}`);
    console.log(`${"multicall deployed to : ".padStart(28)}${multicall.target}`);
    
    saveUniswapAddress(hre.network.name, "WETH", weth.target);
    saveUniswapAddress(hre.network.name, "UniswapV2Factory", factory.target);
    saveUniswapAddress(hre.network.name, "UniswapV2Router02", router2.target);
    saveUniswapAddress(hre.network.name, "Multicall", multicall.target);
    
}

async function getWETH() {
    // 重新部署一个
    console.log(`\n${"-".repeat(32) + getWETH.name + "-".repeat(32)}`);
    const weth9 = await (await (await ethers.getContractFactory('WETH9')).deploy()).waitForDeployment();
    console.log(`${"WETH9 deployed to : ".padStart(28)}${weth9.target}`);
    return weth9;
}


deployUniswap().then(() => console.log(" ")).catch(console.error);