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

    //1ro configurar la conexion con la red de Goerli  
    const network = process.env.ETHEREUM_NETWORK; 

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

    //Esta cuenta signer creada la agregamos a la libreria web3
    web3.eth.accounts.wallet.add(signer);

    //Crear una nueva instancia del contrato para interactuar con el
    const contract = new web3.eth.Contract(
        abi, 
        //Pasamos la variable de entorno donde hicimos deploy del contrato
        process.env.SQUAD_DEPLOYED_ADDRESS
    );

    //Suscribir al evento antes de llamar la funcion que los emite
    contract.events.SquadName().on('data', function(event){
        console.log(`Nuevo evento - squad name ${event.returnValues.name}`);
        //Le agregamos un catch de un error
    }).on('error', function(error, receipt){
        console.log(`Error: ${error}`);
    });

    //Una vez suscriptos los eventos, hay que comunicarse con el contrato x methods
    //Debemos preparar la transaccion (tx) y llamar a los metodos del contrato
    const tx = contract.methods.getTeamName();

    //Ahora hay que enviar la tx, que la blockchain interactue con el contrato
    //y ejecute los metodos
    const receipt = await tx.send({
        //1ro decir quien es el que envia la tx, el que firma,
        from: signer.address,
        //2do pasar el gas que estamos dispuestos a pagar
        gas: await tx.estimateGas()
    })
    //Una vez realizado, pedimos el hash de la tx de etherscan
    .once("transactionHash", (txhash) => {
        console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    });
    
    //Imprimimos x consola que finalizo y el numero de bloque que valido la tx
    console.log(`Block number: ${receipt.blockNumber}`);

    //Una vez finalizada con la funcion, hacemos el require de dotenv
    require("dotenv").config();
    //Luego llamamos a la funcion main, que es todo lo desarrollado al comienzo
    main();
}