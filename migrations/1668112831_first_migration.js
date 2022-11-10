//MIGRATION para hacer el deploy de un contrato
//se agrega una VAR que represente el contrato
//luego declaramos el contrato que queremos hacer el deploy
var SquadContract = artifacts.require("Squad");

module.exports = function(_deployer) {
  //si el constructor del contrato "Squad" recibe parametros,
  //tambien hay que pasarlo en esta seccion
  _deployer.deploy(SquadContract, "Real Madrid");
};
