export type InitializerMessage = {
  userId: string;
  appId: string;
  appName: string;
};

export type HandlerCB = (message: Buffer) => any;
