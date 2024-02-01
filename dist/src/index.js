"use strict";
/**
 *
 * |------------------------------|
 * |     Made by ICe1BotMaker     |
 * |------------------------------|
 *
 * Copyright 2024 Kithub, Inc.
 *
 * Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and
 * associated documentation files (the “Software”),
 * to deal in the Software without restriction,
 * including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to
 * whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice
 * shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const https_1 = __importDefault(require("https"));
const http2_1 = __importDefault(require("http2"));
/**
 * **💫 Javah** - JavaScript framework similar to SpringBoot
 *
 * ```ts
 * import JavahInstance from 'javah';
 * const Javah = new JavahInstance();
 *
 * export default class App {
 *     @Javah.Service(`/api/products`)
 *     public Products = class extends Javah.Page {
 *         public constructor() {
 *             super(); const {
 *                 request, response,
 *                 useState, useError, useFunction, usePath, send
 *             } = this;
 *
 *             if (request.method === `get`) {
 *                 response.status = 200;
 *                 response.header = { 'Content-type': 'application/json' };
 *
 *                 send(usePath(`tests/products.json`));
 *             } else {
 *                 response.status = 404;
 *                 useError(`${request.url} ${response.status} Not Found`);
 *             }
 *         }
 *     }
 * }
 * ```
 */
class Javah {
    constructor() {
        // Saved Routes
        this.routes = [];
        // Saved Utils
        this.utils = { name: `my-app` };
        // Classes inherited for Page Creation
        this.Page = class {
            constructor() {
                // Requests and Responses
                this.request = { method: `get` }; /* FIXME */
                this.response = { method: `get`, status: 200, document: `` };
                // Forwarding and Sending Page Information
                this.send = (data) => { this.response.document = data; };
            }
            // use* method similar to React
            useError(message) { throw new Error(message); }
            useState(value) { return [value, (value_) => value = value_]; }
            useFunction(callback) { return callback; }
            usePath(url) { return (0, fs_1.readFileSync)((0, path_1.resolve)(url), `utf-8`); }
        };
    }
    // A Function inherited by a Service Class Decorator
    Service(path) {
        return (_, key) => {
            this.routes = [...this.routes, { key, path }];
        };
    }
    // A Function inherited by a Create Class Decorator
    Create(name) {
        return (target, _) => {
            if (name)
                this.utils.name = name;
            const app = new target();
            Object.keys(app).forEach(method => this.routes[this.routes.length - 1].queue
                = new app[method]().response);
        };
    }
    // Live Server
    live(port = 8080, config, callback) {
        if (config === null || config === void 0 ? void 0 : config.https) {
            const server = https_1.default.createServer({
                cert: (0, fs_1.readFileSync)(config.https.certificatePath),
                key: (0, fs_1.readFileSync)(config.https.secretKeyPath),
                ca: [
                    (0, fs_1.readFileSync)(config.https.topCertificatePath),
                    (0, fs_1.readFileSync)(config.https.topCertificatePath),
                ]
            }, (req, res) => {
                this.routes.forEach(route => {
                    var _a, _b, _c;
                    if (req.url === route.path) {
                        res.writeHead(((_a = route.queue) === null || _a === void 0 ? void 0 : _a.status) || 200, ((_b = route.queue) === null || _b === void 0 ? void 0 : _b.header) || {});
                        res.write(((_c = route.queue) === null || _c === void 0 ? void 0 : _c.document) || ``);
                        res.end();
                    }
                });
            });
            server.listen(port, callback);
        }
        else {
            const server = http2_1.default.createServer((req, res) => {
                res.write(`<p>asdf</p>`);
                // this.routes.forEach(route => {
                //     if (req.url === route.path) {
                //         res.writeHead(route.queue?.status || 200, route.queue?.header || {});
                //         res.write(route.queue?.document || ``);
                //         res.end();
                //     }
                // });
            });
            server.listen(port, callback);
        }
    }
}
exports.default = Javah;
__decorate([
    __param(0, Log)
], Javah.prototype, "Service", null);
__decorate([
    __param(0, Log)
], Javah.prototype, "Create", null);
// Javah Service Logging Parameter Decorator
function Log(target, key, index) {
    // console.log(`${key} ${index} => ${JSON.stringify(target)}`);
}
exports.Log = Log;
