// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Player.sol";

contract Squad is Ownable {
    string private name;
    Player[] private players;

    event FundsReceived(uint256 amount);
    event PlayerAcquired(string playerName);
    event PlayerSold(string playerName);
    event PlayerAdded(string playerName);
    event SquadName(string name);

    modifier notOwner() {
        require(
            msg.sender != owner(),
            "El dueno no puede ejecutar esta funcion"
        );
        _;
    }

    receive() external payable {
        emit FundsReceived(msg.value);
    }

    fallback() external payable {
        emit FundsReceived(msg.value);
    }

    constructor(string memory clubName) {
        name = clubName;
    }

    function getTeamName() public {
        emit SquadName(name);
    }

    //Toma los params definidos x el constructor de Player.sol
    function addNewPlayer(
        string memory _name,
        string memory _position,
        uint256 _price
    ) public onlyOwner {
        Player newPlayer = new Player(_name, _position, _price);
        players.push(newPlayer);
        emit PlayerAdded(_name);
    }

    //Recibimos como param 1- Address del vendedor y 2- Address del player
    function buyPlayer(address sellerAddress, address newPlayerAddress)
        public
        payable
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
        //emit PlayerAcquired(newPlayer.getMarketPrice());
    }

    //Se recibe el index del array (en este caso del 0 al 10 por ej),
    //Del 0 (Arquero) al 10 (delantero),
    //Esta funcion no la podra ejecutar el Owner
    function sellPlayer(uint256 playerIndex) public payable notOwner {
        //1ro: validar q el indice que se reciba exista (sea < al tamano del [])
        require(playerIndex < players.length, "Indice no encontrado");
        Player playerToSell = players[playerIndex];

        //Validar que el value de la transaccion es igual al valor del jugador
        require(
            msg.value == playerToSell.getMarketPrice(),
            "Fondos insuficientes"
        );
        //El indice mayor sera el length -1 (por la posicion cero)
        //Por ejemplo quiero eliminar el jugador 5 - seria el index 6
        for (uint256 i = playerIndex; i < players.length - 1; i++) {
            //se correra el elemento hacia la ultima posicion del array
            players[i] = players[i + 1];
        }
        //Eliminar el ultimo elemento del array
        players.pop();

        emit PlayerSold(playerToSell.getName());
    }

    //De acuerdo a un rating minimo, se debe devolver los jugadores de ahi en +
    //Los elementos que obtenga, los retornara y los agrupara en un []
    function getDreamTeam(uint256 baseLineRate)
        public
        view
        returns (Player[] memory)
    {
        //1ro debemos establecer un contador
        uint256 dTeamCount;
        //Despues 2 ciclos FOR
        //El 1er ciclo, devolvera cuantos elementos tendra el nuevo []
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i].getAverageRating() >= baseLineRate) {
                dTeamCount++;
            }
        }

        //Creo un array con i elementos
        Player[] memory dTeam = new Player[](dTeamCount);

        //El 2do for es para agregar esos jugadores al nuevo []
        //Creo una nueva VAR auxiliar "j"
        uint256 j = 0;

        for (uint256 i = 0; i < players.length; i++) {
            if (players[i].getAverageRating() > baseLineRate) {
                //al nuevo array se agreguen los players q cumplan las condiciones
                dTeam[j] = players[i];
                j++;
            }
        }

        return dTeam;
    }

    function getPlayers() public view returns (Player[] memory) {
        return players;
    }

    function addRatingToPlayer(uint256 index, uint8 rate) public {
        require(index < players.length, "Indice no encontrado");
        players[index].addNewRate(rate);
    }
}
