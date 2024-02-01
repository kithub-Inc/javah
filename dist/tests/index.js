"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("../src"));
const Javah = new src_1.default();
let App = class App {
    constructor() {
        this.Products = class extends Javah.Page {
            constructor() {
                super();
                const { request } = this;
                if (request.method === `get`)
                    this.get();
                else
                    this.post();
            }
            get() {
                const { response, send, usePath } = this;
                response.status = 200;
                response.header = { 'Content-type': 'application/json' };
                send(usePath(`tests/products.json`));
            }
            post() {
                const { request, response, useError } = this;
                response.status = 404;
                useError(`${request.url} ${response.status} Not Found`);
            }
        };
    }
};
__decorate([
    Javah.Service(`/products`)
], App.prototype, "Products", void 0);
App = __decorate([
    Javah.Create()
], App);
exports.default = App;
Javah.live(8080, {}, () => {
    console.log(`http://localhost:8080`);
});
