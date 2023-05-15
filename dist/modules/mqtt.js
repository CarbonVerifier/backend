"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class MqttController {
    constructor() {
        this.package = {
            temperature: 0.0,
            light: 0.0,
            co2: 0.0,
            humidity: 0.0,
        };
        this.client = mqtt_1.default.connect(String(process.env.BROKER_SERVER), {
            port: Number(process.env.BROKER_PORT),
            username: String(process.env.BROKER_USER),
            password: String(process.env.BROKER_PASSWORD),
            protocol: 'mqtts',
        });
        this.client.on('connect', () => {
            console.log('mqtt connected');
        });
        this.client.on('error', (error) => {
            console.log("Can't connect" + error);
        });
        this.client.subscribe(['temperature', 'light', 'co2', 'humidity']);
        this.client.on('message', this.handleMessage.bind(this));
    }
    handleMessage(topic, message) {
        switch (topic) {
            case 'temperature':
                //console.log('updated temperature: ' + message.toString());
                this.package.temperature = parseFloat(message);
                break;
            case 'light':
                //console.log('updated light: ' + message.toString());
                this.package.light = parseFloat(message);
                break;
            case 'co2':
                //console.log('updated co2: ' + message.toString());
                this.package.co2 = parseFloat(message);
                break;
            case 'humidity':
                //console.log('updated humidity: ' + message.toString());
                this.package.humidity = parseFloat(message);
                break;
            default:
                console.log('topic not found');
                break;
        }
    }
    getCurrentPackage() {
        return this.package;
    }
}
exports.default = MqttController;
