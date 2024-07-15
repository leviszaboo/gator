import { KeyValuePair, RunTaskCommand } from "@aws-sdk/client-ecs";
import { Config } from "../utils/options";
import { InitializerMessage } from "../types/rmq.types";
import { generateEnvironment } from "../utils/ecs.utils";

const generateInitializerTaskCommand = ({
  userId,
  appName,
  appId,
}: InitializerMessage): RunTaskCommand => {
  const environment: KeyValuePair[] = generateEnvironment({
    userId,
    appName,
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
        securityGroups: ["sg-07aa5cfbf0934c3a0"],
        assignPublicIp: "ENABLED",
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "gator-app",
          environment,
        },
      ],
    },
  });

  return command;
};

export default generateInitializerTaskCommand;
