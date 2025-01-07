const hre = require("hardhat");
const {getTokenAddresses} = require("./utils");
const {tokens} = require("./tokens")

async function verifyTokens() {
  const items = getTokenAddresses()[hre.network.name];

  if (tokens.length != Object.keys(items).length) {
    throw new Error("addresses length wrong!");
  }

  for (let token of tokens) {
    const contractAddress = items[token.name]
    console.log("contractAddress: ", contractAddress);
    console.log("token.name: ", token.name);
    console.log("token.symbol: ", token.symbol);

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [token.name, token.symbol],
      contract: "contracts/Token.sol:Token"
    });
  }
}

verifyTokens();