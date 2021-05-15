import { SwagclanApp } from "../application";

export class BotClientApplication extends SwagclanApp {
    constructor() {
        super("bot");
    }
}

const app = new BotClientApplication;

(async () => {
    await app.start();
})();

export { app };
