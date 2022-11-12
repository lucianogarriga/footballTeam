const Squad = artifacts.require("Squad");
const utils = require("./helpers/utils");

//1ro se define una funcion del contrato, 
//luego una funcion con las address que vamos a interactuar
contract("Squad", function (accounts) {

  //definimos una VAR que utilizaremos en varios test
  let contract;
  //Address que deployo el contrato
  const [alice, bob] = accounts;

  beforeEach(async () => {
    //asignamos valor a la VAR global ya declarada
    contract = await Squad.deployed();
  });
  //1er test = empiezan con it y el metodo que se va a testear, 
  //luego async function()
  it("addNewPlayer should add the Player to the list", async function () {
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
    assert.equal(players.length, 1, "El tamaño de la lista deberia ser 1");
  });

  it("addNewPlayer should fail if the caller is not the owner", async function () {
    //1) SET UP = Inicializar variables  
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
        { from: bob }
      )
    )
  });
});
