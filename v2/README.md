# Sample Hardhat Project

deploy uniswap-v2 contracts

## 运行

安装依赖
```shell
npm install
npx hardhat compile
```

初始化准备
```
npx hardhat run scripts/contract-init.js --network sepolia
```

部署 uniswap 合约
```
npx hardhat run scripts/deploy-uniswap.js --network sepolia
npx hardhat run scripts/verify-uniswap.js  --network sepolia
```

部署验证 tokens，可修改 `tokens.js` 中要部署的合约
```
npx hardhat run scripts/deploy-tokens.js --network sepolia
npx hardhat run scripts/verify-tokens.js --network sepolia
```