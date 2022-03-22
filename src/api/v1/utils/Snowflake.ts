import cluster from 'node:cluster'

export class Snowflake extends null {
  static readonly EPOCH = new Date('2021-01-26').getTime()
  static INCREMENT = 0n
  static processId = BigInt(process.pid % 31)
  static workerId = BigInt((cluster.worker?.id || 0) % 31)

  static generate(now = Date.now()): string {
    if (this.INCREMENT >= 4095n) this.INCREMENT = 0n
    const time = BigInt(now - this.EPOCH) << 22n
    const workerId = this.workerId << 17n
    const processId = this.processId << 12n
    const increment = this.INCREMENT++
    return (time | workerId | processId | increment).toString()
  }

  static timestampOf(id: string): number {
    return Number(BigInt(id) >> 22n) + Snowflake.EPOCH
  }
  private static generateToken(n: number) {
      var chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      var token = "";
      for (var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
      }
      return token;
  }
  static createToken(id: string, lastupdate: number, len: number) {
    return `${Buffer.from(id).toString("base64")}.${Buffer.from(
      (lastupdate / 1000 + this.EPOCH).toString()
    ).toString("base64")}.${Buffer.from(this.generateToken(len)).toString(
      "base64"
    )}`;
  }
}
