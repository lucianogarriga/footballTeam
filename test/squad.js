const Squad = artifacts.require("Squad");
const utils = require("./helpers/utils");
//P/ funcion buyPlayer
const Player = artifacts.require("Player");

//1ro se define una funcion del contrato, 
//luego una funcion con las address que vamos a interactuar
contract("Squad", function (accounts) {

  //definimos una VAR que utilizaremos en varios test
  let contract;
  //Address que deployo el contrato
  const [alice, bob] = accounts;

  beforeEach(async () => {
    //asignamos valor a la VAR global ya declarada
    //Debemos usar .new() xq necesitamos 1 nueva instancia x cada test 
    // y utiliza 1 address unico para c/ test
    contract = await Squad.new("Real Madrid");
  });

  context("Function: addNewPlayer", async function () {
    //1er test = empiezan con it y el metodo que se va a testear, 
    //luego async function()
    it("should add the Player to the list", async function () {
      //1) SET UP = Inicializar variables 
      //In BeforeEach()

      //2) ACT = Ejecutar lo que se va a testear
      //agarramos la instancia (contract) y llamamos la funcion (addNewPlayer)
      await contract.addNewPlayer(
        //le debemos pasar los parametros que recibe el metodo/funcion
        "Cristiano Ronaldo",
        "DEL",
        234000,
        { from: alice }
      )
      //verificar cuantos elementos tiene la lista y lo guardamos en una VAR
      let players = await contract.getPlayers();

      //3) ASSERT = Comprobar que los datos que devuelve son los correctos
      //que la longitud del array tenga la cantidad de Players que agregamos (1)
      //en caso de no ser correcto, que tire el error y emita el mensaje
      assert.equal(players.length, 1, "Player list should be 1");
    });

    it("should fail if the caller is not the owner", async function () {
      //1) SET UP = Inicializar variables  
      let notOwner = bob;
      //In BeforeEach() 

      //2) ACT = Ejecutar  
      //importamos la funcion de utils para reutilizar codigo
      await utils.shouldThrow(
        contract.addNewPlayer(
          //le debemos pasar los parametros que recibe el metodo/funcion
          "Cristiano Ronaldo",
          "DEL",
          234000,
          //al final de todos los parametros podemos indicar quien llama la funcion
          //default siempre llama de la cuenta [0]
          { from: notOwner }
        )
      )
    });

    it("should be called by the owner", async function () {
      //1) SET UP 
      let owner = alice;
      //2) ACT = Ejecutar lo que se va a testear 
      await contract.addNewPlayer(
        "Cristiano Ronaldo",
        "DEL",
        234000,
        { from: owner }
      )

      assert(true);
    });

  });

  context("Function: buyPlayer", async function () {
    it("should add the newPlayer to the list", async function () {
      //Set up
      let ownerOfPlayer = bob;
      //Inicializar el player - Ver el constructor de Player.sol 
      let newPlayer = await Player.new("Messi", "DEL", 2);
      let contractBalance = 1;

      //usamos una library (web3) p/ comunicarnos con la blockchain
      await web3.eth.sendTransaction({
        to: contract.address,
        from: bob,
        value: web3.utils.toWei(contractBalance.toString(), "ether")
      });

      //Act
      await contract.buyPlayer(
        ownerOfPlayer,
        //al ya haberse creado el newPlayer, le pasamos el address como prop 
        newPlayer.address
      )

      //verificar cuantos elementos tiene la lista y lo guardamos en una VAR
      let players = await contract.getPlayers();

      //3) ASSERT = Comprobar que la longitud del array sea (1) 
      assert(players.length, 1, "Player list should be 1");
    });


    it("should fail if the team not have enough founds", async function () {
      //Set up
      let ownerOfPlayer = bob;
      //Inicializar el player - Ver el constructor de Player.sol 
      let playerPrice = 20000000;
      let contractBalance = 1;
      let newPlayer = await Player.new("Messi", "DEL", playerPrice);

      await web3.eth.sendTransaction({
        to: contract.address,
        from: bob,
        value: web3.utils.toWei(contractBalance.toString(), "wei")
      });

      //Act
      await utils.shouldThrow(
        contract.buyPlayer(
          ownerOfPlayer,
          //al ya haberse creado el newPlayer, le pasamos el address como prop 
          newPlayer.address
        )
      )

    });


    //Test para verificar que emita el evento, y que se llame de esa forma
    it("should emit event PlayerAcquired", async function () {
      //Set up
      let ownerOfPlayer = bob;
      let newPlayer = await Player.new("Messi", "DEL", 2);
      let contractBalance = 1;

      //Act
      await web3.eth.sendTransaction({
        to: contract.address,
        from: bob,
        value: web3.utils.toWei(contractBalance.toString(), "ether")
      });

      //Act
      let tx = await contract.buyPlayer(
        ownerOfPlayer,
        newPlayer.address
      )

      //Testear el evento : 1ro crear una VAR (tx)
      //2do luego hay un array dentro que se llama .logs[]
      //3ro agarramos el log de la posicion index 0 y
      //4to lo guardamos en otra VAR (log)
      let log = tx.logs[0];

      //Assert
      assert.equal(log.event, "PlayerAcquired");
    });


    it("should emit event PlayerAcquired with price (param)", async function () {
      //Set up
      let ownerOfPlayer = bob;
      let playerPrice = 2;
      let newPlayer = await Player.new("Messi", "DEL", playerPrice);
      let contractBalance = 1;

      //Act
      await web3.eth.sendTransaction({
        to: contract.address,
        from: bob,
        value: web3.utils.toWei(contractBalance.toString(), "ether")
      });

      //Act
      let tx = await contract.buyPlayer(
        ownerOfPlayer,
        newPlayer.address
      )

      let log = tx.logs[0];
      //console.log(log);

      //Assert
      //1ro el parametro transformarlo a un string
      //2do la VAR transformarla a un string
      assert.equal(log.args.price.toString(), playerPrice.toString());
    });
  });

});
