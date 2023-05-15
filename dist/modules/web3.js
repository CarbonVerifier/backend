"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DEFAULT_ABI = require('../../artifacts/abi.json').abi;
class Web3Producer {
    constructor() {
        this.hdwallet = new HDWalletProvider(String(process.env.MNEMONIC), 'https://alfajores-forno.celo-testnet.org');
        this.w3 = new Web3(this.hdwallet);
    }
    getRevertReason(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield this.w3.eth.getTransaction(txHash);
            var result = yield this.w3.eth.call(tx, tx.blockNumber);
            result = result.startsWith('0x') ? result : `0x${result}`;
            if (result && result.substr(138)) {
                const reason = this.w3.utils.toAscii(result.substr(138));
                console.log('Revert reason:', reason);
                return reason;
            }
            else {
                console.log('Cannot get reason - No return value');
            }
        });
    }
    runtime(embedded_package, contract_address) {
        return __awaiter(this, void 0, void 0, function* () {
            const { co2 } = embedded_package;
            const contract = new this.w3.eth.Contract(DEFAULT_ABI, contract_address);
            console.log('Sending data to blockchain... CO2: ' + co2);
            const accounts = yield this.w3.eth.getAccounts();
            console.log(accounts[0]);
            const transaction = yield contract.methods
                .SetCarbonEmitted(100)
                .send({ from: accounts[0] })
                .catch((err) => __awaiter(this, void 0, void 0, function* () {
                console.log(err);
                yield this.getRevertReason(err.transactionHash);
            }))
                .then((res) => {
                console.log(res);
            });
        });
    }
}
exports.default = Web3Producer;
