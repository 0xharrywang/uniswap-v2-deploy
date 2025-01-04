const { ethers } = require("hardhat");

/*
* 代码流程：
* 1- 代币部署：[WETH9, USDT, TOKN]
* 2- 交易所部署：Uniswap x 2
* 3- 交易对部署：[WETH-TOKN, USDT-TOKN, WETH-USDT] x 2
* */
async function main() {
    const {weth, usdt, tokn} = await deployTokens();
    // 部署 Uniswap 合约
    const {router: router, factory: factory} = await deployUniswap(weth);
    // 添加流动性，创建币对
    const {weth_tokn, usdt_tokn, weth_usdt} = await createPairs(weth, usdt, tokn, router, factory);
    // const {router: router2, factory: factory2} = await deployUniswap(weth);
    // await createPairs(weth, usdt, tokn, router2, factory2);

    // TODO 后面可部署自己的合约逻辑
    console.log(`\n${"-".repeat(32) + deployTokens.name + "-".repeat(32)}`); // 显示 deployTokens 信息
    // 除 Uniswap 部署者之外的账户 user1 
    const [ , user1] = await ethers.getSigners();
    // 首先将 weth 转给 user1 
    await (await weth.transfer(user1.address, 1000n * 10n ** 18n)).wait();
    console.log("weth balance of " + user1.address, (await weth.balanceOf(user1.address)).toString())
    // user1 向 uniswapRouter 进行 approve 
    await (await weth.connect(user1).approve(router.target, ethers.MaxInt256)).wait()
    const allowance = await weth.allowance(user1.address, router.target); // 查询 user1 授权情况
    console.log("weth allowance ", router.target, allowance.toString())
}


async function deployTokens() {
    console.log(`\n${"-".repeat(32) + deployTokens.name + "-".repeat(32)}`);
    const Token = await ethers.getContractFactory("Token");

    const [weth, usdt, tokn] = await Promise.all([
        (await (await ethers.getContractFactory('WETH9')).deploy()).waitForDeployment(),
        (await Token.deploy(`USDT TOKEN`, `USDT`)).waitForDeployment(),
        (await Token.deploy(`TOKN TOKEN`, `TOKN`)).waitForDeployment()
    ])
    console.log(`${"WETH9 deployed to : ".padStart(28)}${weth.target}`);
    console.log(`${"USDT deployed to : ".padStart(28)}${usdt.target}`);
    console.log(`${"TOKN deployed to : ".padStart(28)}${tokn.target}`);

    return {weth, usdt, tokn};
}

async function deployUniswap(weth) {
    console.log(`${"-".repeat(32) + deployUniswap.name + "-".repeat(32)}`);
    // 部署 UniswapV2Factory
    const factory = await (await (await ethers.getContractFactory('UniswapV2Factory')).deploy((await ethers.getSigners())[0].address)).waitForDeployment();
    // 部署 UniswapV2Router02
    const router = await (await (await ethers.getContractFactory('UniswapV2Router02')).deploy(factory.target, weth.target)).waitForDeployment();
    console.log(`${"Factory deployed to : ".padStart(28)}${factory.target}`);
    console.log(`${"Pair init code is : ".padStart(28)}${await factory.pairCodeHash()}`);  
    console.log(`${"Router deployed to : ".padStart(28)}${router.target}`);

    return {factory, router};
}

async function createPairFactory(router, factory) {
    const deadline = Math.floor((new Date()).getTime() / 1000) + 20 * 60;
    const amountOf = (num) => (10n ** 18n * BigInt(num)).toString();
    const toAddress = (await ethers.getSigners())[0].address;
    return async (tokenA, tokenB, numA, numB) => {
        let tx = await router.addLiquidity(tokenA, tokenB, amountOf(numA), amountOf(numB), amountOf(numA), amountOf(numB), toAddress, deadline);
        let receipt = await tx.wait();
        
        // 返回 pair 的地址
        // 解析事件
        let log = receipt.logs.filter((log) => log.address === factory.target)[0];
        return factory.interface.decodeFunctionResult("createPair", log.data).pair;
    }
}


async function createPairs(weth, usdt, tokn, router, factory) {
    console.log(`${"-".repeat(11) + createPairs.name + `[${router.target}]` + "-".repeat(11)}`);
    // 1- Approve router
    const MAX = 2n ** 256n - 1n;
    await Promise.all([
        weth.approve(router.target, MAX),
        usdt.approve(router.target, MAX),
        tokn.approve(router.target, MAX)
    ]);
    // // 2- Add Liquidity
    const createPair = await createPairFactory(router, factory);
    const [weth_tokn, usdt_tokn, weth_usdt] = await Promise.all([
        createPair(weth.target, tokn.target, 10, 100), // weth中需要有余额
        createPair(usdt.target, tokn.target, 10, 100),
        createPair(weth.target, usdt.target, 100, 100)
    ]);
    console.log(`${"WETH-TOKN Liquidity : ".padStart(28)}${weth_tokn}`);
    console.log(`${"USDT-TOKN Liquidity : ".padStart(28)}${usdt_tokn}`);
    console.log(`${"WETH-USDT Liquidity : ".padStart(28)}${weth_usdt}`);
    // 返回各个 pair 的地址
    return {weth_tokn, usdt_tokn, weth_usdt};
}

main().then(() => console.log(" ")).catch(console.error);