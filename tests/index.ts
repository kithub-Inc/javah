import FrameWork, { Request } from '../src';
const Javah = new FrameWork();

@Javah.Create()
export default class App {
    @Javah.Service(`/api/products`) @Javah.Cors()
    public Products = class extends Javah.Page {
        public request: Request;

        public constructor(request: Request) {
            super(); this.request = request;
            if (this.request.method === `get`) this.get();
            else this.post();
        }

        public get() {
            this.response.header = { 'Content-type': 'text/html charset=utf-8' };
            this.response.send(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body>
                <p>이건 겟인데 ㅠㅠ</p>
            </body>
            </html>`);
        }

        public post() {
            this.response.header = { 'Content-type': 'application/json' };
            this.response.send(this.usePath(`tests/products.json`));
        }
    }
}

Javah.live(8080, {}, () => {
    console.log(`http://localhost:8080`);
});