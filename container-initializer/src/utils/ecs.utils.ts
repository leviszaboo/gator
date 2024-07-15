import { generateKeyPairSync } from "crypto";
import { InitializerMessage } from "../types/rmq.types";
import { KeyValuePair } from "@aws-sdk/client-ecs";
import { v4 as uuid } from "uuid";
import { Config } from "./options";

export const generateEnvironment = ({
  userId,
  appName,
  appId,
}: InitializerMessage): KeyValuePair[] => {
  const apiKey = uuid();

  const { publicKey: actPublicKey, privateKey: actPrivateKey } =
    generateKeyPairSync("rsa", {
      modulusLength: 4096,
    });

  const { publicKey: rftPublicKey, privateKey: rftPrivateKey } =
    generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });

  const environment: KeyValuePair[] = [
    {
      name: "NODE_ENV",
      value: "production",
    },
    {
      name: "ACT_PUBLIC_KEY",
      value: actPublicKey
        .export({
          type: "spki",
          format: "pem",
        })
        .toString(),
    },
    {
      name: "ACT_PRIVATE_KEY",
      value: actPrivateKey
        .export({
          type: "pkcs8",
          format: "pem",
        })
        .toString(),
    },
    {
      name: "RFT_PUBLIC_KEY",
      value: rftPublicKey
        .export({
          type: "spki",
          format: "pem",
        })
        .toString(),
    },
    {
      name: "RFT_PRIVATE_KEY",
      value: rftPrivateKey
        .export({
          type: "pkcs8",
          format: "pem",
        })
        .toString(),
    },
    {
      name: "APP_ID",
      value: appId,
    },
    {
      name: "API_KEY",
      value: apiKey,
    },
    {
      name: "DATABASE_URL",
      value: Config.CONTAINER_DATABASE_URL,
    },
    {
      name: "POSTGRES_PASSWORD",
      value: Config.CONTAINER_POSTGRES_PASSWORD,
    },
    {
      name: "BCRYPT_SALT",
      value: Config.CONTAINER_BCRYPT_SALT,
    },
  ];

  return environment;
};
