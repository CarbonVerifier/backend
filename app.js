const express = require('express');
require('dotenv').config();
const cors = require('cors');

const SwapController = require('./modules/swap.js').SwapController;
const MqttController = require('./modules/mqtt.js').MqttController;

const mqttController = new MqttController();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/swap_tokens', SwapController.swap);

app.get('/package', (req, res) => {
	res.send(mqttController.getPackage());
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
