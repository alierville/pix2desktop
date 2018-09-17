interface ThenRedis {
  set( key: string, value: any ): void;
  expire( key: string, timeoutSec: number ): void;
  del( key: string ): void;
  incr( key: string ): Promise<number>;
  decr( key: string ): Promise<number>;
  publish( channel: string, val: any ): void;
  quit(): void;
  on( eventName: string, listener: ( ...args ) => void ): void;

  get<T>( key: string ): Promise<T>;
  subscribe( channel: string ): Promise<number>;
  unsubscribe( channel: string ): Promise<number>;
}
