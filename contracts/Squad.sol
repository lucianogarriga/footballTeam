// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Player.sol";

contract Squad is Ownable {
    string private name;
    Player[] private players;

    event FundsReceived(uint256 amount);
    event PlayerAcquired(uint256 price);

    receive() external payable {
        emit FundsReceived(msg.value);
    }

    fallback() external payable {
        emit FundsReceived(msg.value);
    }

    constructor(string memory _name) {
        name = _name;
    }

    //Funcion p/ agregar un player, toma los parametros definidos x el constructor de Player.sol
    function addNewPlayer(
        string memory _name,
        string memory _position,
        uint256 _price
    ) public onlyOwner {
        Player player = new Player(_name, _position, _price);
        players.push(player);
    }
    //Recibimos como param 1- Address del vendedor y 2- Address del player
    function buyPlayer(address sellerAddress, address newPlayerAddress)
        public
        onlyOwner
    {
        Player newPlayer = Player(newPlayerAddress);
        require(
            address(this).balance >= newPlayer.getMarketPrice(),
            "El equipo no tiene fondos suficientes"
        );
        (bool sent, ) = sellerAddress.call{value: newPlayer.getMarketPrice()}(
            ""
        );

        require(sent, "Error en la transferencia");
        players.push(newPlayer);
        emit PlayerAcquired(newPlayer.getMarketPrice());
    }

    function getPlayers() public view returns (Player[] memory) {
        return players;
    }

    function getSquadName() public view returns (string memory) {
        return name;
    }

    function getDreamTeam() public {}

    function sellPlayer() public {}
}
