export default class App {
    Products: {
        new (): {
            get(): void;
            post(): void;
            request: import("../src").Request;
            response: import("../src").Response;
            useError(message: string): void;
            useState<T>(value: T): [T, Function];
            useFunction(callback: Function): Function;
            usePath(url: string): string;
            send: (data: any) => void;
        };
    };
}
