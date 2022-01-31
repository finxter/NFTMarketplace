var FinxterArt = artifacts.require("./finxterArt.sol");

module.exports = (deployer, network, accounts) => {

  deployer.then(async () => {
    try {
      await deployer.deploy(FinxterArt, "FinxterArtToken", "FT");
	
    } catch (err) {
      console.log(('Failed to Deploy new Contract', err))
    }
  })

}