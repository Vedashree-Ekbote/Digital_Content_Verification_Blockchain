require("@nomicfoundation/hardhat-toolbox");
// https://eth-sepolia.g.alchemy.com/v2/RuE83N5-YIkfrP_hDuYLKb6IDBNmJE-s
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks:{
    Sepolia:{
      url:'https://eth-sepolia.g.alchemy.com/v2/RuE83N5-YIkfrP_hDuYLKb6IDBNmJE-s',
      accounts:['1500db2e66772ede80254bd00d3b3cf6023b1f0b002d7506c5807bed295510c0']
    }
  }
};
