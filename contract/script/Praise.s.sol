// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../src/Praise.sol";
import { Script, console2 } from "forge-std/Script.sol";

contract DeployPraise is Script {
    address public token = 0x7b97031b6297bc8e030B07Bd84Ce92FEa1B00c3e;
    address public eas = 0x72E1d8ccf5299fb36fEfD8CC4394B8ef7e98Af92;
    address public schemaRegistry = 0x5ece93bE4BDCF293Ed61FA78698B594F2135AF34;

    function run() external {
        vm.startBroadcast();
        new Praise(token, eas, schemaRegistry);
        
    }
}
