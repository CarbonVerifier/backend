import { ethers } from 'ethers';
import ToucanClient from 'toucan-sdk';
import dotenv from 'dotenv';

dotenv.config();

class ToucanSDK {
	private toucan: ToucanClient;
	private provider: ethers.JsonRpcProvider;
	private wallet: ethers.Wallet;
	private signer: ethers.Wallet;

	constructor() {
		this.toucan = new ToucanClient('alfajores');
		this.provider = new ethers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
		this.wallet = new ethers.Wallet(String(process.env.PRIVATE_KEY), this.provider);
		this.signer = this.wallet.connect(this.provider);
	}
}
