const express = require("express");
require("dotenv").config();
var bodyParser = require("body-parser");
const cors = require("cors");
const { FusionSDK } = require("@1inch/fusion-sdk");
const Web3 = require("web3");

const app = express();
app.use(cors());

app.use(express.json()); //Irá suportar JSON
app.use(
  bodyParser.urlencoded({
    // Irá suportar urlenconded
    extended: true,
  })
);

const PORT = process.env.PORT || 3001;

app.get("/convert_tokens", (req, res) => {
  const { makerAddress, amount } = req.body;

  const nodeUrl = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

  // const blockchainProvider = PrivateKeyProviderConnector(
  //   makerPrivateKey,
  //   new Web3(nodeUrl)
  // );
  const blockchainProvider = new Web3(nodeUrl);

  const sdk = new FusionSDK({
    url: "https://fusion.1inch.io",
    network: 1,
    blockchainProvider,
  });

  sdk
    .placeOrder({
      fromTokenAddress: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", // MATIC
      toTokenAddress: "0x9916E3B2dEF03Ce1d54A4D6eDCf25126999B4046", // Carbon Verifier Token
      amount: amount, // in wei
      walletAddress: makerAddress,
    })
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.send("Carbon Verifier Token not deployed yet on eth mainet");
    });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});