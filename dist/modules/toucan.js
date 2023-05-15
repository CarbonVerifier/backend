"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const toucan_sdk_1 = __importDefault(require("toucan-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class ToucanSDK {
    constructor() {
        this.toucan = new toucan_sdk_1.default('alfajores');
        this.provider = new ethers_1.ethers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
        this.wallet = new ethers_1.ethers.Wallet(String(process.env.PRIVATE_KEY), this.provider);
        this.signer = this.wallet.connect(this.provider);
        //this.toucan.setProvider(this.provider);
        //this.toucan.setSigner(this.signer);
    }
}
