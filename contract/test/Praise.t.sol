// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Praise.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "forge-std/console.sol";
import { IEAS } from "eas-contracts/IEAS.sol";
import { ISchemaRegistry } from "eas-contracts/ISchemaRegistry.sol";

contract MockToken is ERC20 {
    constructor(address recipient) ERC20("Mock Token", "MTK") {
        _mint(recipient, 1000 * 10 ** decimals());
    }
}

contract PraiseTest is Test {
    Praise public praise;
    IERC20 public token;
    IEAS public eas;
    ISchemaRegistry public schemaRegistry;

    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    uint256 public constant INITIAL_BALANCE = 1000 * 10 ** 18;

    // Celo Mainnet addresses
    address public constant EAS_ADDRESS = 0x72E1d8ccf5299fb36fEfD8CC4394B8ef7e98Af92;
    address public constant SCHEMA_REGISTRY_ADDRESS = 0x5ece93bE4BDCF293Ed61FA78698B594F2135AF34;

    function setUp() public {
        // Deploy mock token
        token = IERC20(address(new MockToken(alice)));
        // Connect to existing contracts on Celo
        eas = IEAS(EAS_ADDRESS);
        schemaRegistry = ISchemaRegistry(SCHEMA_REGISTRY_ADDRESS);

        // Deploy Praise contract with real contract addresses
        praise = new Praise(address(token), EAS_ADDRESS, SCHEMA_REGISTRY_ADDRESS);
    }

    function testPraiseWithTip() public {
        vm.startPrank(alice);
        token.approve(address(praise), 1000 * 10 ** 18);

        bytes32 uid = praise.praiseWithTip("Good job!", alice, bob, 1000 * 10 ** 18);
        assertEq(token.balanceOf(alice), 0);
        assertEq(token.balanceOf(bob), 1000 * 10 ** 18);

        bytes memory attestationData = eas.getAttestation(uid).data;
        (string memory comment, address from, address to, uint256 amount, address tokenAddress, uint256 decimals) =
            abi.decode(attestationData, (string, address, address, uint256, address, uint256));

        assertEq(comment, "Good job!");
        assertEq(from, alice);
        assertEq(to, bob);
        assertEq(amount, 1000 * 10 ** 18);
        assertEq(tokenAddress, address(token));
        assertEq(decimals, 18);
    }
}
