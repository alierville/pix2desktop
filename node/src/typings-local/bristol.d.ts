// Type definitions for Bristol
// Project: https://github.com/TomFrost/Bristol
// Definitions by: KT Dev Team
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare namespace Bristol {
  interface LoggerConf {
    setSeverities( names: string[] ): void;
    addTarget( target: string, param?: any ): LoggerConf;
    withFormatter( formatter: string ): LoggerConf;
    addTransform( cb: ( elem: any ) => void ): LoggerConf;
    setGlobal( key: string, val: any ): LoggerConf;
    deleteGlobal( key: string ): LoggerConf;
    withLowestSeverity( name: string ): LoggerConf;
    withHighestSeverity( name: string ): LoggerConf;
    onlyIncluding( opt: any ): LoggerConf;
  }

  interface DefaultSeverities {
    trace( ...params: any[] ): void;
    debug( ...params: any[] ): void;
    info( ...params: any[] ): void;
    warn( ...params: any[] ): void;
    error( ...params: any[] ): void;
    fatal( ...params: any[] ): void;
  }

  interface Logger extends LoggerConf, DefaultSeverities {
  }

  interface BristolConstructor {
    prototype: Logger;
    new (): Logger;
  }

  interface LoggerMod extends Logger {
    Bristol: BristolConstructor;
  }
}

declare module "bristol" {
  let _tmp: Bristol.LoggerMod;
  export = _tmp;
}
