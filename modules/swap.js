const { FusionSDK } = require("@1inch/fusion-sdk");
const Web3 = require("web3");
const {
  PrivateKeyProviderConnector,
} = require("@1inch/fusion-sdk/connector/blockchain/private-key-provider.connector");

class SwapController {
  static async swap(req, res) {
    const amount = req.body.amount;
    const fromTokenAddress = req.body.fromTokenAddress;
    const toTokenAddress = req.body.toTokenAddress;
    const makerAddress = req.body.makerAddress || process.env.MAKER_ADDRESS;

    const nodeUrl = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;

    let web3 = new Web3(nodeUrl);
    // console.log(web3);
    const blockchainProvider = new PrivateKeyProviderConnector(
      process.env.PRIVATE_KEY,
      web3
    );

    const sdk = new FusionSDK({
      url: "https://fusion.1inch.io",
      network: 137,
      blockchainProvider,
    });

    sdk
      .placeOrder({
        fromTokenAddress: fromTokenAddress, //"0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // MATIC
        toTokenAddress: toTokenAddress, //"0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // Carbon Verifier Token
        amount: amount, // in wei
        walletAddress: makerAddress,
      })
      .then((data) => {
        console.log(data);
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
}

module.exports = { SwapController };
