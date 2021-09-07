declare module "socket.io-client" {
  type SocketEventHandler = (evt: string, data: unknown) => void;

  declare class Socket {
    on(evt: string, handler: SocketEventHandler): void;

    open(): Socket;
    connect(): Socket;
    close(): Socket;
    disconnect(): Socket;
  }

  type ConnectOptions = Record<string, unknown> & {
    autoConnect: boolean;
  };

  export const connect: (url: string, options?: ConnectOptions) => Socket;
}
