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

import bodyParser from 'body-parser';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import https from 'https';
import http from 'http';
import url from 'url';

export interface Route {
    key: string;
    path: string;
    cors?: boolean;
    queue: ({new (request: Request): {
        request: Request;
        response: Response;
    }} | undefined);
}

// Global interface dedicated to request and response
export interface IResq {
    status?: number;
    method?: (`get` | `post` | `put` | `delete`);
    header?: { 'Content-type'?: string };
}

// Global Interface Reference
export interface Request extends IResq { url?: string; body?: any; params?: any; query?: any; }
export interface Response extends IResq { document?: string; send: (data: any) => void }

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
export default class Javah {
    // Saved Routes
    public routes: Array<Route> = [];

    // Saved Utils
    public utils: { name: string; } = { name: `my-app` };
    
    // Classes inherited for Page Creation
    public Page = class {
        // Requests and Responses
        public response: Response = {
            status: 200,
            document: ``,

            // Forwarding and Sending Page Information
            send: (data: any) => this.response.document = data
        };

        // use* method similar to React
        public useError(message: string) { throw new Error(message); }
        public useState<T>(value: T): [T, Function] { return [value, (value_: T) => value = value_]; }
        public useFunction(callback: Function) { return callback; }
        public usePath(url: string) { return readFileSync(resolve(url), `utf-8`); }
    }

    // A Function inherited by a Create Class Decorator
    public Create(@MinLength(3) name?: string): Function {
        return (target: { new (): any }) => {
            if (name) this.utils.name = name;

            const app = new target();
            Object.keys(app).forEach((method, idx) =>
            this.routes[idx].queue
            = app[method]);
        }
    }

    // A Function inherited by a Service Property Decorator
    public Service(@PathValidator() path: string): Function {
        return (_: any, key: string) => {
            this.routes = [...this.routes, { key, path, cors: false, queue: undefined }];
        }
    }

    // A Function inherited by a Cors Property Decorator
    public Cors(): Function {
        return (_: any, key: string) => {
            const idx = this.routes.findIndex(e => e.key === key);
            if (this.routes[idx]) this.routes[idx].cors = true;
        }
    }

    // Live Server
    public live(port: number = 8080, config: Config, callback: () => void) {
        const handle = (req: any, res: any) => {
            const route = this.routes.find(e => e.path === url.parse(req.url).pathname);

            let body = ``;
            req.on(`data`, (chunk: string) => body += chunk);

            req.on(`end`, () => {
                if (route?.queue) { // page exists
                    const head = new route.queue({
                        method: req.method.toLowerCase(),
                        body: body,
                        query: url.parse(req.url, true).query,
                        params: req.params
                    });
    
                    res.writeHead(head.response.status || 200, head.response.header || {});
                    res.write(head.response.document || ``);
                    res.end();
                } else { // page not exists
                    if (route?.cors) res.setHeader(`Access-Control-Allow-Origin`, `*`);
                    res.writeHead(404, { 'Content-type': 'text/html' });
                    res.write(`<h1 style="text-align: center;">404 Not Found</h1>`);
                    res.end();
                }
            });
        }

        // Https Configure Check
        if (config?.https) {
            const server = https.createServer({
                cert: readFileSync(config.https.certificatePath),
                key: readFileSync(config.https.secretKeyPath),
                ca: [
                    readFileSync(config.https.topCertificatePath),
                    readFileSync(config.https.topCertificatePath),
            ]}, handle);
            
            server.listen(port, callback);
        } else {
            const server = http.createServer(handle);

            server.listen(port, callback);
        }
    }
}

// Minimum Length Limiting Parameters Decorator
export function MinLength(min: number) {
    return (target: any, key: string, index: number) => {
        target.validators = {
            minLength: (args: string[]) => args[index].length >= min
        }
    }
}

// URL Validation Parameters Decorator
export function PathValidator() {
    return (target: any, key: string, index: number) => {
        target.validators = {
            pathValid: (args: string[]) => args[index].startsWith(`/`)
        }
    }
}