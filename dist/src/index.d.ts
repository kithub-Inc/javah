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
export interface JavahDecorator {
    (_: any, key: (string | object)): void;
}
export interface Route {
    key: (string | object);
    path: string;
    queue?: Response;
}
export interface IResq {
    status?: number;
    method?: (`get` | `post`);
    header?: {
        'Content-type'?: string;
    };
}
export interface Request extends IResq {
    url?: string;
}
export interface Response extends IResq {
    document?: string;
}
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
    routes: Array<Route>;
    utils: {
        name: string;
    };
    Page: {
        new (): {
            request: Request;
            response: Response;
            useError(message: string): void;
            useState<T>(value: T): [T, Function];
            useFunction(callback: Function): Function;
            usePath(url: string): string;
            send: (data: any) => void;
        };
    };
    Service(path: string): JavahDecorator;
    Create(name?: string): (target: any, _?: any) => void;
    live(port: number | undefined, config: Config, callback: () => void): void;
}
export declare function Log(target: any, key: string, index: number): void;
