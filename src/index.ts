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

import { readFileSync } from 'fs';
import { resolve } from 'path';
import https from 'https';
import http from 'http2';

// Service Decorator Interface for Router Usage
export interface JavahDecorator {
    (_: any, key: (string | object)): void;
}

export interface Route {
    key: (string | object);
    path: string;
    queue?: Response;
}

// Global interface dedicated to request and response
export interface IResq {
    status?: number;
    method?: (`get` | `post`);
    header?: { 'Content-type'?: string };
}

// Global Interface Reference
export interface Request extends IResq { url?: string; }
export interface Response extends IResq { document?: string; }

// Https Configure
export interface Config {
    https?: {
        certificatePath: string;
        secretKeyPath: string;
        topCertificatePath: string;
    };
}

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
export default class Javah {
    // Saved Routes
    public routes: Array<Route> = [];

    // Saved Utils
    public utils: { name: string } = { name: `my-app` };
    
    // Classes inherited for Page Creation
    public Page = class {
        // Requests and Responses
        public request: Request = { method: `get` }; /* FIXME */
        public response: Response = { method: `get`, status: 200, document: `` };

        // use* method similar to React
        public useError(message: string) { throw new Error(message); }
        public useState<T>(value: T): [T, Function] { return [value, (value_: T) => value = value_]; }
        public useFunction(callback: Function) { return callback; }
        public usePath(url: string) { return readFileSync(resolve(url), `utf-8`); }
    
        // Forwarding and Sending Page Information
        public send = (data: any) => { this.response.document = data; }
    }

    // A Function inherited by a Service Class Decorator
    public Service(@Log path: string): JavahDecorator {
        return (_, key) => {
            this.routes = [...this.routes, { key, path }];
        }
    }

    // A Function inherited by a Create Class Decorator
    public Create(@Log name?: string) {
        return (target: any, _?: any) => {
            if (name) this.utils.name = name;

            const app = new target();
            Object.keys(app).forEach(method =>
            this.routes[this.routes.length - 1].queue
            = new app[method]().response);
        }
    }

    // Live Server
    public live(port: number = 8080, config: Config, callback: () => void) {
        if (config?.https) {
            const server = https.createServer({
                cert: readFileSync(config.https.certificatePath),
                key: readFileSync(config.https.secretKeyPath),
                ca: [
                    readFileSync(config.https.topCertificatePath),
                    readFileSync(config.https.topCertificatePath),
            ]}, (req, res) => {
                this.routes.forEach(route => {
                    if (req.url === route.path) {
                        res.writeHead(route.queue?.status || 200, route.queue?.header || {});
                        res.write(route.queue?.document || ``);
                        res.end();
                    }
                });
            });
            
            server.listen(port, callback);
        } else {
            const server = http.createServer((req, res) => {
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

// Javah Service Logging Parameter Decorator
export function Log(target: any, key: string, index: number) {
    // console.log(`${key} ${index} => ${JSON.stringify(target)}`);
}