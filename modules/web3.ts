const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
import dotenv from 'dotenv';
import { Package } from './mqtt';

dotenv.config();

const DEFAULT_ABI = require('../../artifacts/abi.json').abi;

export default class Web3Producer {
	w3: any;
	hdwallet: any;

	constructor() {
		this.hdwallet = new HDWalletProvider(String(process.env.MNEMONIC), 'https://alfajores-forno.celo-testnet.org');
		this.w3 = new Web3(this.hdwallet);
	}

	async getRevertReason(txHash: any) {
		const tx = await this.w3.eth.getTransaction(txHash);

		var result = await this.w3.eth.call(tx, tx.blockNumber);

		result = result.startsWith('0x') ? result : `0x${result}`;

		if (result && result.substr(138)) {
			const reason = this.w3.utils.toAscii(result.substr(138));
			console.log('Revert reason:', reason);
			return reason;
		} else {
			console.log('Cannot get reason - No return value');
		}
	}

	async runtime(embedded_package: Package, contract_address: string) {
		const { co2 } = embedded_package;
		const contract = new this.w3.eth.Contract(DEFAULT_ABI, contract_address);

		console.log('Sending data to blockchain... CO2: ' + co2);
		const accounts = await this.w3.eth.getAccounts();
		console.log(accounts[0]);
		const transaction = await contract.methods
			.SetCarbonEmitted(100)
			.send({ from: accounts[0] })
			.catch((err: any) => {
				console.log(err);
			})
			.then((res: any) => {
				console.log(res);
			});
	}
}
