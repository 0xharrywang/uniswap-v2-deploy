
const path = require("path");
const fs = require("fs");

const filePaths = {
  uniswap:  path.join(__dirname, '../deployments/uniswap-addresses.json'),
  token: path.join(__dirname, '../deployments/tokens-addresses.json')
};

function _getAddresses(type) {
  const filePath = filePaths[type];
  let json
  try {
      json = fs.readFileSync(filePath)
  } catch (err) {
      json = '{}'
  }
  const addrs = JSON.parse(json)
  return addrs
}

function _saveAddress(type, network, contract, address) {
  const filePath = filePaths[type];
  const addrs = _getAddresses(type)
  addrs[network] = addrs[network] || {}
  addrs[network][contract] = address
  fs.writeFileSync(filePath, JSON.stringify(addrs, null, '    '))
}

function getUniswapAddresses() {
  return _getAddresses("uniswap");
}


function getTokenAddresses() {
  return _getAddresses("token");
}

function saveUniswapAddress(network, contract, address) {
  _saveAddress("uniswap", network, contract, address);
}

function saveTokenAddress(network, contract, address) {
  _saveAddress("token", network, contract, address);
}


module.exports = {
  getUniswapAddresses,
  saveUniswapAddress,
  getTokenAddresses,
  saveTokenAddress
}