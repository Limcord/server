import kleur from "kleur";
import { config } from ".";
const time = () => new Date().toTimeString().slice(0, 8);

const color = (mode: keyof Logger): string => {
  switch (mode) {
    case "error":
      return kleur.red("ERROR");
    case "warn":
      return kleur.yellow("WARN");
    case "info":
      return kleur.blue("INFO");
    case "log":
      return kleur.green("LOG");
    case "debug":
      return kleur.yellow("DEBUG");
  }
};
export class Logger {
  private base(data: unknown[], type: keyof Logger) {
    console.log(`[${kleur.grey(time())}] - [${color(type)}]:`, ...data);
  }
  log(...data: unknown[]) {
    this.base(data, "log");
  }
  error(...data: unknown[]) {
    this.base(data, "error");
  }
  info(...data: unknown[]) {
    this.base(data, "info");
  }
  warn(...data: unknown[]) {
    this.base(data, "warn");
  }
  debug(...data: unknown[]) {
    if (config.status == "development") this.base(data, "debug");
  }
}
export const logger = new Logger();
