// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TokenUpgradeable is Initializable, ERC20Upgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 public redeemCounter;

    event Redeemed(address indexed user, uint256 amount);

    address public admin;
    event AdminSet(address adminSet);

    function initialize(string memory name, string memory symbol, address _admin) public initializer {
        __ERC20_init(name, symbol);
        __AccessControl_init();
        __UUPSUpgradeable_init();

        admin = _admin;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);


        _mint(admin, 100 * 10 ** decimals());

        // Debug
        emit Transfer(address(0), admin, 100 * 10 ** decimals());
        emit AdminSet(admin);
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function redeem(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _transfer(msg.sender, admin, amount);
        redeemCounter += 1;
        emit Redeemed(msg.sender, amount);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}