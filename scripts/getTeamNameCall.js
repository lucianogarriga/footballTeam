//Importamos la libreria de Web3
const Web3 = require("web3");

//Filesystem de Js
const fs = require("fs");
//Pasar al script el abi que se genera en el archivo Squad.json
//Luego ubicamos donde esta el abi y el metodo de lectura
//El script se llama desde la raiz del proyecto
const { abi } = JSON.parse(fs.readFileSync("./build/contracts/Squad.json"));

//La funcion que se va a llamar cuando ejecutemos el script
async function main() {

    //1ro configurar la conexion con la red de Goerli y el Api Key
    const network = process.env.ETHEREUM_NETWORK;
    const apiKey = process.env.INFURA_API_KEY;

    //Se debe instanciar la libreria de Web3
    const web3 = new Web3(
        //Debemos pasar la url de Infura
        //Para obtener eventos, no llamamos HTTPS sino x Websockets(wss)
        //P/ dejar abierta una conexion y recibir eventos
        process.env.INFURA_URL
    );

    //P/ hacer tx, deben estar FIRMADAS y necesitamos la private key
    //Utilizamos la libreria web3, y c/ nuestra key genera un objeto tipo account
    const signer = web3.eth.accounts.privateKeyToAccount(process.env.ACCOUNT_PRIVATE_KEY);

    //Agregamos la cuenta signer a web3
    web3.eth.accounts.wallet.add(signer);

}