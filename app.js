const express = require('express');
const schedule = require('node-schedule');
require('dotenv').config();
const cors = require('cors');

const SwapController = require('./modules/swap.js').SwapController;
const MqttController = require('./modules/mqtt.js').MqttController;
const EthersProducer = require('./modules/ethers.js').EthersProducer;
const ethers_producer = new EthersProducer();

const mqttController = new MqttController();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/swap_tokens', SwapController.swap);

app.get('/package', (req, res) => {
	res.send(mqttController.getPackage());
});

app.get('/events', (req, res) => {
	res.json(require('./artifacts/events.json').events);
});

const task = schedule.scheduleJob('*/10 * * * * *', async () => {
	const addresses = require('./artifacts/address.json');
	const embedded_package = mqttController.getPackage();

	const company = ['Klabin', 'FaberCastell', 'Gerdau', 'Vale', 'Unilever'][Math.floor(Math.random() * 5)];

	await ethers_producer.runtime(embedded_package, addresses[company], company);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
