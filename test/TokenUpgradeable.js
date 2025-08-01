const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenUpgradeable", function () {
  let Token, token, admin, minter, user;

  beforeEach(async () => {
    [admin, minter, user] = await ethers.getSigners();
    Token = await ethers.getContractFactory("TokenUpgradeable");
    token = await upgrades.deployProxy(Token, ["MyToken", "MTK", admin.address], { initializer: "initialize" });
    await token.grantRole(await token.MINTER_ROLE(), minter.address);
  });

  it("should mint tokens by minter", async () => {
    await token.connect(minter).mint(user.address, 1000);
    expect(await token.balanceOf(user.address)).to.equal(1000);
  });

  it("should not mint tokens by non-minter", async () => {
    await expect(token.connect(user).mint(user.address, 1000)).to.be.reverted;
  });

  it("should burn tokens", async () => {
    await token.connect(minter).mint(user.address, 1000);
    await token.connect(user).burn(500);
    expect(await token.balanceOf(user.address)).to.equal(500);
  });

  it("should redeem tokens and increment counter", async () => {
    await token.connect(minter).mint(user.address, 1000);
    await token.connect(user).redeem(200);
    expect(await token.balanceOf(user.address)).to.equal(800);
    expect(await token.redeemCounter()).to.equal(1);
  });

  it("should not redeem more than balance", async () => {
    await expect(token.connect(user).redeem(100)).to.be.revertedWith("Insufficient balance");
  });

  it("should upgrade contract", async () => {
    const TokenV2 = await ethers.getContractFactory("TokenUpgradeableV2");
    const tokenV2 = await upgrades.upgradeProxy(token.address, TokenV2);
    expect(await tokenV2.version()).to.equal("v2!");
  });

  it("should redeem tokens and increment counter", async () => {
    await token.connect(minter).mint(user.address, 1000);
    await token.connect(user).redeem(200);
    expect(await token.balanceOf(user.address)).to.equal(800);
    expect(await token.redeemCounter()).to.equal(1);
  });

  it("should emit Redeemed event with correct values", async () => {
    await token.connect(minter).mint(user.address, 1000);

    await expect(token.connect(user).redeem(200))
      .to.emit(token, "Redeemed")
      .withArgs(user.address, 200);
  });


});