pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PoiToken is ERC20 {
    constructor () public ERC20("Poi Token", "POI") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }
}
