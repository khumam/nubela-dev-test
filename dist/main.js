"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
const lambdaCalculus_1 = __importDefault(require("./lambdaCalculus"));
const args = process.argv.slice(2);
const socketPath = args[0] || "/var/run/dev-test/sock";
const isValidJson = (request) => {
    try {
        JSON.parse(request);
        return true;
    }
    catch (err) {
        return false;
    }
};
const server = net.createServer((socket) => {
    let mergedRequest = "";
    socket.on('data', (req) => {
        if (typeof req === "object" && isValidJson(req)) {
            const request = JSON.parse(req.toString());
            if (request.method === "echo") {
                const result = {
                    id: request.id,
                    result: request.params
                };
                socket.write(JSON.stringify(result) + "\n");
            }
            else if (request.method === "evaluate") {
                const expression = (0, lambdaCalculus_1.default)(request);
                const result = {
                    id: request.id,
                    result: {
                        expression
                    }
                };
                socket.write(JSON.stringify(result) + "\n");
            }
        }
        else {
            if (/\n/.exec(req.toString())) {
                const splitedReqWithLineBreak = req.toString().split(/\n/);
                mergedRequest = mergedRequest + splitedReqWithLineBreak[0];
                if (isValidJson(mergedRequest)) {
                    const request = JSON.parse(mergedRequest);
                    const result = {
                        id: request.id,
                        result: request.params
                    };
                    socket.write(JSON.stringify(result) + "\n");
                }
                mergedRequest = splitedReqWithLineBreak[1];
            }
            else {
                mergedRequest = (mergedRequest.includes(req.toString)) ? req.toString() : mergedRequest + req.toString();
            }
        }
    });
    socket.on('error', (err) => {
        console.log('Socker error:', err);
        process.exit(0);
    });
});
server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(0);
});
server.listen(socketPath);
