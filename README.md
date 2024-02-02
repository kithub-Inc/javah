# 💫 Javah
**JavaScript framework** similar to **SpringBoot**.

### 💬 Express, are you tired of java?
✅ Somewhere **between Express and Java**, you can easily adapt to the **Familiar Environment**.
- **있어보이는 문법**: Grammar that seems to be there
- **개쩌는 성능**: An **Amazing Framework** created by ICe1BotMaker

### 💾 Installation
Installation that takes less than a few seconds:
```bash
$ npm install javah@latest
```

### 🎥 Usage
It's kind of like a **쌈@뽕**. It's a familiar grammar:
```ts
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
            this.response.send(`THIS IS GET`);
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
```