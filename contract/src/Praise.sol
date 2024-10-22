// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import { IEAS, Attestation, AttestationRequest, AttestationRequestData } from "eas-contracts/IEAS.sol";
import { ISchemaRegistry } from "eas-contracts/ISchemaRegistry.sol";
import { SchemaResolver } from "eas-contracts/resolver/SchemaResolver.sol";
import { ISchemaResolver } from "eas-contracts/resolver/ISchemaResolver.sol";
import { AttesterResolver } from "./AttesterResolver.sol";

contract Praise {
    IERC20Metadata public token;
    IEAS public eas;
    ISchemaRegistry public schemaRegistry;
    AttesterResolver public resolver;
    bytes32 public schemaUID;

    constructor(address _token, address _eas, address _schemaRegistry) {
        token = IERC20Metadata(_token);
        eas = IEAS(_eas);
        schemaRegistry = ISchemaRegistry(_schemaRegistry);

        resolver = new AttesterResolver(IEAS(_eas), address(this));

        schemaUID = ISchemaRegistry(_schemaRegistry).register(
            "string praise, address from, address to, uint256 amount, address token, uint256 decimals",
            ISchemaResolver(resolver),
            true
        );
    }

    function praiseWithTip(
        string memory _praise,
        address _from,
        address _to,
        uint256 _amount
    )
        external
        returns (bytes32 attestationUID)
    {
        require(msg.sender == _from, "Praise: Invalid sender");

        bool sent = token.transferFrom(_from, _to, _amount);

        require(sent, "Praise: Transfer failed");

        bytes memory data = abi.encode(_praise, _from, _to, _amount, address(token), token.decimals());
        AttestationRequestData memory requestData = AttestationRequestData({
            recipient: _to,
            expirationTime: 0,
            revocable: true,
            refUID: 0x0,
            data: data,
            value: 0
        });
        AttestationRequest memory request = AttestationRequest({ schema: schemaUID, data: requestData });
        attestationUID = eas.attest(request);

        require(attestationUID != 0x0, "Praise: Attestation failed");

        return attestationUID;
    }
}
