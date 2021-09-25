const Token = artifacts.require("Token");

module.exports = async function (deployer) {
  await deployer.deploy(Token, "Giga Chad", "gc.png");
  let tokenI = await Token.deployed();
  await tokenI.mint(0, 85, 185, 0, 0);
  let athlete = await tokenI.getTokenDetails(0);
  console.log(athlete);
};
