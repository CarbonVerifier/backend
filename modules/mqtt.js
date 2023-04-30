const mqtt = require('mqtt');
require('dotenv').config();

class MqttController {
	constructor() {
		this.client = mqtt.connect(process.env.BROKER_SERVER, {
			port: process.env.BROKER_PORT,
			username: process.env.BROKER_USER,
			password: process.env.BROKER_PASSWORD,
			protocol: 'mqtts',
		});

		this.client.on('connect', () => {
			console.log('mqtt connected');
		});

		this.client.on('error', (error) => {
			console.log("Can't connect" + error);
		});

		this.client.subscribe(['temperature', 'light', 'co2', 'humidity']);

		this.package = {
			temperature: 0,
			light: 0,
			co2: 0,
			humidity: 0,
		};

		this.client.on('message', this.handleMessage.bind(this));
	}

	handleMessage(topic, message) {
		switch (topic) {
			case 'temperature':
				console.log('updated temperature: ' + message.toString());
				this.package.temperature = message.toString();
				break;
			case 'light':
				console.log('updated light: ' + message.toString());
				this.package.light = message.toString();
				break;
			case 'co2':
				console.log('updated co2: ' + message.toString());
				this.package.co2 = message.toString();
				break;
			case 'humidity':
				console.log('updated humidity: ' + message.toString());
				this.package.humidity = message.toString();
				break;
			default:
				console.log('topic not found');
				break;
		}
	}

	getPackage() {
		return this.package;
	}
}

module.exports = { MqttController };
