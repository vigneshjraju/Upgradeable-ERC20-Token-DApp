// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenUpgradeable.sol";

contract TokenUpgradeableV2 is TokenUpgradeable {
    function version() public pure returns (string memory) {
        return "v2!";
    }
}