export type InitializerMessage = {
  userId: string;
  appId: string;
  appName: string;
};

export type StatusMessage = {
  apiKey: string;
  status: string;
} & InitializerMessage;

export type HandlerCB = (message: Buffer) => any;
