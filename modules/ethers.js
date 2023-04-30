const { ethers } = require('ethers');
const fs = require('fs');

const DEFAULT_ABI = require('../artifacts/abi.json').abi;

class EthersProducer {
	constructor() {
		this.provider = new ethers.AlchemyProvider(80001, process.env.ALCHEMY_API_KEY);
		this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
		this.connected_wallet = this.wallet.connect(this.provider);

		this.wss_provider = new ethers.WebSocketProvider(`wss://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
	}

	async runtime(embedded_package, contract_address, company) {
		console.log(embedded_package);
		const { temperature, light, co2, humidity } = embedded_package;

		if (isNaN(temperature) || isNaN(light) || isNaN(co2) || isNaN(humidity)) {
			console.log('Invalid data.');
			return;
		}

		let contract = new ethers.Contract(contract_address, DEFAULT_ABI, this.connected_wallet);

		const callback = (contract_address, payload) => {
			console.log('Status event received.');
			const event = {
				contract_address,
				company,
				payload,
			};

			// appent to file temp.json from artifacts folder
			let content = require('../artifacts/events.json').events;

			content.push(event);

			fs.writeFileSync('./artifacts/events.json', JSON.stringify({ events: content }));

			console.log('event: ', event);
		};

		contract.on('status', callback);

		console.log('Sending data to blockchain...');
		const transaction = await contract.CarbonVerifierCheck(parseInt(temperature), parseInt(light), parseInt(co2), parseInt(humidity));
		console.log('Transaction sent to blockchain.');
		const receipt = await transaction.wait();
		console.log('Transaction mined.');

		console.log(receipt);
		const { status } = receipt;
		const { payload } = status;

		return payload;
	}
}

module.exports = {
	EthersProducer,
};
