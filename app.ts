import schedule from 'node-schedule';
import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import MqttController from './modules/mqtt';
import Web3Producer from './modules/web3';

import { Package } from './modules/mqtt';

dotenv.config();

const web3_producer = new Web3Producer();
const mqttController = new MqttController();

const app: Express = express();
app.use(cors());
app.use(express.json());

app.get('/package', (req, res) => {
	res.send(mqttController.getCurrentPackage());
});

app.get('/events', (req, res) => {
	res.json(require('./artifacts/events.json').events);
});

const task = schedule.scheduleJob('*/10 * * * * *', async () => {
	const embedded_package: Package = mqttController.getCurrentPackage();

	const addresses: any = require('../artifacts/address.json');
	const company_address: string = addresses['MainContract'];

	await web3_producer.runtime(embedded_package, company_address);
});

task.invoke();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
