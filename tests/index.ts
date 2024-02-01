import FrameWork from '../src';
const Javah = new FrameWork();

@Javah.Create()
export default class App {
    @Javah.Service(`/products`)
    public Products = class extends Javah.Page {
        public constructor() {
            super(); const { request } = this;
            
            if (request.method === `get`) this.get();
            else this.post();
        }

        public get() {
            const { response, send, usePath } = this;

            response.status = 200;
            response.header = { 'Content-type': 'application/json' };
            
            send(usePath(`tests/products.json`));
        }

        public post() {
            const { request, response, useError } = this;

            response.status = 404;
            useError(`${request.url} ${response.status} Not Found`);
        }
    }
}

Javah.live(8080, {}, () => {
    console.log(`http://localhost:8080`);
});