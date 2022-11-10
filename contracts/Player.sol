// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Player {
    string private name;
    string private position;
    uint256[] private ratings;
    uint256 private averageRating;
    uint256 private price;

    event RateAdded(uint rate);

    constructor(
        string memory _name, 
        string memory _position, 
        uint _price) 
        {
        name = _name;
        position = _position;
        price = _price;
        }
    //Se agrega un nuevo Rate al ratings[] y se emite un evento para ver el newRate agregado
    function addNewRate(uint newRate) public {
        ratings.push(newRate);
        calculateAverageRate();
        emit RateAdded(newRate);
    }
    //Una funcion que retorna el valor del averageRating (que se encuentra en una VAR global privada)
    function getAverageRating() public view returns(uint256) {
        return averageRating;
    }
    //Una funcion get para interactuar de afuera y ver los ratings del array, con una funcion public
    function getRatings() public view returns(uint[] memory){
        return ratings;
    }

    //Otra manera de hacerlo es con una VAR de estado que sea el counter/acumulador (suma de todos los rates)
    function calculateAverageRate() public {
        uint amount = 0;
        for (uint i = 0; i<ratings.length; i++){
            amount += ratings[i];
        }
        averageRating = amount / ratings.length;
        //este resultado al guardarse en una VAR global, no necesitamos retornar nada
    }
    //Funcion getter del price, que se encuentra en una VAR global PRIVATE;
    function getMarketPrice() public view returns(uint){
        return price;
    }
}
