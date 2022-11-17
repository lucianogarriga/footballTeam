const Web3 = require("web3");

const fs = require("fs");
const { abi } = JSON.parse(fs.readFileSync("../build/contracts/Squad.json"));

async function main() {

    const network = process.env.ETHEREUM_NETWORK;
    const apiKey = process.env.INFURA_API_KEY;

    const web3 = new Web3(
        process.env.INFURA_URL
    );

    const signer = web3.eth.accounts.privateKeyToAccount();

}