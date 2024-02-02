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
exports.PathValidator = exports.MinLength = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
/**
 * **💫 Javah** - JavaScript framework similar to SpringBoot
 *
 * ```ts
 * import JavahInstance from 'javah';
 * const Javah = new JavahInstance();
 *
 * \@Javah.Create()
 * export default class App {
 *     \@Javah.Service(`/`)
 *     public Home = class extends Javah.Page {
 *         constructor() { super(); this.response.send(`<h1>Hello, world!</h1>`); }
 *     }
 * }
 *
 * Javah.live(8080, {}, () => {
 *     console.log(`http://localhost:8080`);
 * });
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
                this.response = {
                    status: 200,
                    document: ``,
                    // Forwarding and Sending Page Information
                    send: (data) => this.response.document = data
                };
            }
            // use* method similar to React
            useError(message) { throw new Error(message); }
            useState(value) { return [value, (value_) => value = value_]; }
            useFunction(callback) { return callback; }
            usePath(url) { return (0, fs_1.readFileSync)((0, path_1.resolve)(url), `utf-8`); }
        };
    }
    // A Function inherited by a Create Class Decorator
    Create(name) {
        return (target) => {
            if (name)
                this.utils.name = name;
            const app = new target();
            Object.keys(app).forEach((method, idx) => this.routes[idx].queue
                = app[method]);
        };
    }
    // A Function inherited by a Service Property Decorator
    Service(path) {
        return (_, key) => {
            this.routes = [...this.routes, { key, path, cors: false, queue: undefined }];
        };
    }
    // A Function inherited by a Cors Property Decorator
    Cors() {
        return (_, key) => {
            const idx = this.routes.findIndex(e => e.key === key);
            if (this.routes[idx])
                this.routes[idx].cors = true;
        };
    }
    // Live Server
    live(port = 8080, config, callback) {
        const handle = (req, res) => {
            const route = this.routes.find(e => e.path === url_1.default.parse(req.url).pathname);
            let body = ``;
            req.on(`data`, (chunk) => body += chunk);
            req.on(`end`, () => {
                if (route === null || route === void 0 ? void 0 : route.queue) { // page exists
                    const head = new route.queue({
                        method: req.method.toLowerCase(),
                        body: body,
                        query: url_1.default.parse(req.url, true).query,
                        params: req.params
                    });
                    res.writeHead(head.response.status || 200, head.response.header || {});
                    res.write(head.response.document || ``);
                    res.end();
                }
                else { // page not exists
                    if (route === null || route === void 0 ? void 0 : route.cors)
                        res.setHeader(`Access-Control-Allow-Origin`, `*`);
                    res.writeHead(404, { 'Content-type': 'text/html' });
                    res.write(`<h1 style="text-align: center;">404 Not Found</h1>`);
                    res.end();
                }
            });
        };
        // Https Configure Check
        if (config === null || config === void 0 ? void 0 : config.https) {
            const server = https_1.default.createServer({
                cert: (0, fs_1.readFileSync)(config.https.certificatePath),
                key: (0, fs_1.readFileSync)(config.https.secretKeyPath),
                ca: [
                    (0, fs_1.readFileSync)(config.https.topCertificatePath),
                    (0, fs_1.readFileSync)(config.https.topCertificatePath),
                ]
            }, handle);
            server.listen(port, callback);
        }
        else {
            const server = http_1.default.createServer(handle);
            server.listen(port, callback);
        }
    }
}
exports.default = Javah;
__decorate([
    __param(0, MinLength(3))
], Javah.prototype, "Create", null);
__decorate([
    __param(0, PathValidator())
], Javah.prototype, "Service", null);
// Minimum Length Limiting Parameters Decorator
function MinLength(min) {
    return (target, key, index) => {
        target.validators = {
            minLength: (args) => args[index].length >= min
        };
    };
}
exports.MinLength = MinLength;
// URL Validation Parameters Decorator
function PathValidator() {
    return (target, key, index) => {
        target.validators = {
            pathValid: (args) => args[index].startsWith(`/`)
        };
    };
}
exports.PathValidator = PathValidator;
