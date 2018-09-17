/**
 * This is the description of the object <code>log</code> exported by the module <code>ServerContext</code>.
 */
interface Log {
  trace( ...params: any[] ): void;
  debug( ...params: any[] ): void;
  info( ...params: any[] ): void;
  warn( ...params: any[] ): void;
  error( ...params: any[] ): void;
  fatal( ...params: any[] ): void;
}
