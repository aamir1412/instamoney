//var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var InstaMoney = artifacts.require("InstaMoney");

module.exports = function(deployer) {
  //deployer.deploy(SimpleStorage);
  deployer.deploy(InstaMoney);
};
