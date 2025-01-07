
const hre = require("hardhat");
const { ethers } = require("hardhat");
const {saveTokenAddress} = require("./utils")
const {tokens} = require("./tokens")


/*
* 按需部署 Token
**/
async function deployTokens() {
    console.log(`\n${"-".repeat(32) + deployTokens.name + "-".repeat(32)}`);
    const Token = await ethers.getContractFactory("Token");

    for (const { name, symbol } of tokens) {
      const token = await (await Token.deploy(name, symbol)).waitForDeployment();
      console.log(`${name} (${symbol}) deployed to : ${token.target}`);
      saveTokenAddress(hre.network.name, name, token.target);
    }
}


deployTokens().then(() => console.log(" ")).catch(console.error);


