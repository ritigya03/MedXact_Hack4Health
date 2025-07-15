require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/c02a2bbb18c647b79a34006c51366978",
      accounts: ["6ab8022f903de7807f903722ad92e1afd4b3d0216ae28dca9f623c5400584132"]
    }
  }
};
