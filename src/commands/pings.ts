import { BotCommand } from "../client/Command";

export default new BotCommand({
    name: "Ping",
    trigger: "pinger",
    description: "Ping the bot and get response times.",
    params: [],
    async exec() {

    }
});
