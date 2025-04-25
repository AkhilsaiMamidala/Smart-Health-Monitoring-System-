require("@nomicfoundation/hardhat-toolbox");

module.exports = {
    solidity: "0.8.0",
    networks: {
        localhost: {
            url: "HTTP://192.168.1.8:7545",
        },
    },
};
