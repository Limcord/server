const tuple = <T extends string[]>(...args: T) => args;

export interface IConstants {
  versions: typeof Constants.versions[number];
}
export abstract class Constants {
  static readonly versions = tuple("v1", "v2");
  static readonly baseurl = 'http://localhost:3000'
}
