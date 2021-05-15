import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import chalk from "chalk";
import util from "util";
import dayjs from "dayjs";

import { SwagclanApp } from "../application";

export function stripColours(text: string) {
    return text.replace(/\x1b\[\d+m/g, "");
}

export class AppLogger {
    stream: fs.WriteStream;

    constructor(private app: SwagclanApp) {
        this.stream = fs.createWriteStream(app.namespace + ".log.txt", {
            flags: "a"
        });
    }

    write(pref: string, tmpl: string, ...fmt: any[]) {
        const id = uuidv4();
        const date = chalk.grey(
            "[" + dayjs().format("MMMM DD YYYY, hh:mm:ss") + "]"
        );
        const formatted =
            date +
            " " +
            chalk.grey("{" + this.app.namespace + "}") +
            " " +
            pref +
            " " +
            util.format(tmpl, ...fmt);
        const stripped = stripColours(formatted);

        this.stream.write("<" + id + "> " + stripped + "\n");
        process.stdout.write(formatted + "\n");
        return id;
    }

    log(tmpl: string, ...fmt: any[]) {
        return this.write(chalk.grey("  log ●"), tmpl, ...fmt);
    }

    success(tmpl: string, ...fmt: any[]) {
        return this.write(chalk.green("  win ✓"), tmpl, ...fmt);
    }

    info(tmpl: string, ...fmt: any[]) {
        return this.write(chalk.blue(" info ●"), tmpl, ...fmt);
    }

    warn(tmpl: string, ...fmt: any[]) {
        return this.write(chalk.yellow(" warn ⚠"), tmpl, ...fmt);
    }

    error(tmpl: string, ...fmt: any[]) {
        return this.write(chalk.redBright("error ⨯"), tmpl, ...fmt);
    }

    fatal(tmpl: string, ...fmt: any[]) {
        return this.write(chalk.red("fatal ⨯"), tmpl, ...fmt);
    }
}
