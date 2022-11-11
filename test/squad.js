const Squad = artifacts.require("Squad");

//primero se define una funcion del contrato,
//luego una funcion con las address que vamos a interactuar
contract("Squad", function (/*accounts*/) {

  //1er test = empiezan con it y el metodo que se va a testear, 
  //luego async function()
  it("addNewPlayer should add the Player to the list", async function () {
    //1) SET UP = Inicializar variables
    //Como el player ya se crea x constructor, no hay que inicializarlo
    //agarramos la instancia del contrato deployado
    let contract = await Squad.deployed();

    //2) ACT = Ejecutar lo que se va a testear
    //agarramos la instancia (contract) y llamamos la funcion (addNewPlayer)
    await contract.addNewPlayer(
      //le debemos pasar los parametros que recibe el metodo/funcion
      "Cristiano Ronaldo",
      "DEL",
      234000
    )

    //verificar cuantos elementos tiene la lista y lo guardamos en una VAR
    let players = await contract.getPlayers();
    //3) ASSERT = Comprobar que los datos que devuelve son los correctos
    assert.equal(players.length, 1, "El tamaño de la lista deberia ser 1");
  });
});














//   let contract;
//   //Es el address que deployo el contrato
//   //las dos var siguientes representan 2 personas 
//   const [alice,bob] = accounts;

//   beforeEach(async() => {
//     contract = await Squad.deployed();
//   });

//   it ("addNewPlayer should add the Player", async function(){
//     let notOwner = bob;

//     await contract.addNewPlayer(
//       "CR7",
//       "DEL",
//       20000,
//       {from: notOwner}
//     );

//     let players = await contract.getPlayers();

//     //Assert: Comprobar datos
//     assert.equal(players.length, 1, "El tamanio de la lista deberia ser 1");
//   })

//   it("addNewPlayer should be call by owner", async function () {
//     let owner = alice;

//     await  
//       contract.addNewPlayer(
//         "CR7",
//         "DEL",
//         20000,
//         {from: owner} 
//   )
//   assert(true);
//   });
// });
