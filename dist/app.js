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
const node_schedule_1 = __importDefault(require("node-schedule"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mqtt_1 = __importDefault(require("./modules/mqtt"));
const web3_1 = __importDefault(require("./modules/web3"));
dotenv_1.default.config();
const web3_producer = new web3_1.default();
const mqttController = new mqtt_1.default();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/package', (req, res) => {
    res.send(mqttController.getCurrentPackage());
});
app.get('/events', (req, res) => {
    res.json(require('./artifacts/events.json').events);
});
const task = node_schedule_1.default.scheduleJob('*/10 * * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const embedded_package = mqttController.getCurrentPackage();
    const addresses = require('../artifacts/address.json');
    const company_address = addresses['MainContract'];
    yield web3_producer.runtime(embedded_package, company_address);
}));
task.invoke();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
