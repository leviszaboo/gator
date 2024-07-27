import { generateKeyPairSync } from "crypto";
import { KeyValuePair, RunTaskCommand } from "@aws-sdk/client-ecs";
import { v4 as uuid } from "uuid";
import { Config } from "./options";

type EcsEnvArgs = {
  apiKey: string;
  appId: string;
};

export const generateEnvironment = ({
  appId,
  apiKey,
}: EcsEnvArgs): KeyValuePair[] => {
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

export const generateInitializerTaskCommand = (appId: string) => {
  const apiKey = uuid();

  const environment: KeyValuePair[] = generateEnvironment({
    apiKey,
    appId,
  });

  const command = new RunTaskCommand({
    cluster: Config.ECS_CLUSTER,
    taskDefinition: Config.TASK_DEFINITION,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: [
          "subnet-0b88c14e5d184b8f9",
          "subnet-0c4f8bf8c7ca48835",
          "subnet-01264f07de9ce4375",
        ],
        securityGroups: ["sg-086878988150f6a62"],
        assignPublicIp: "ENABLED",
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "node-app-1",
          environment,
        },
        {
          name: "postgres",
          environment: [
            {
              name: "POSTGRES_PASSWORD",
              value: Config.CONTAINER_POSTGRES_PASSWORD,
            },
          ],
        },
      ],
    },
  });

  return { apiKey, command };
};
