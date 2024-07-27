import { DescribeTasksCommand } from "@aws-sdk/client-ecs";
import { Config } from "./options";
import ecsClient from "../aws/ecsClient";
import logger from "./logger";

export const getTaskPrivateIps = async (taskIds: string[]) => {
  const input = {
    cluster: Config.ECS_CLUSTER,
    tasks: taskIds,
  };

  const command = new DescribeTasksCommand(input);

  const res = await ecsClient.send(command);

  if (!res.tasks) {
    return [];
  }

  const privateIps = res.tasks.map((task) => {
    if (
      task.attachments &&
      task.attachments[0].details &&
      task.overrides &&
      task.overrides.containerOverrides
    ) {
      const privateIp = task.attachments[0].details.find(
        (detail) => detail.name === "privateIPv4Address",
      );

      const taskId = task.taskArn?.split("/").pop();
      const appId = task.overrides.containerOverrides[0].environment?.find(
        (env) => env.name === "APP_ID",
      )?.value;

      if (!taskId || !appId) {
        logger.error(`Error identifying task: ${task}`);

        return {
          taskId: "",
          appId: "",
          privateIp: "",
        };
      }

      if (!privateIp || !privateIp.value) {
        logger.error(`Error getting private ip for task: ${taskId}`);

        return {
          taskId,
          appId,
          privateIp: "",
        };
      } else {
        return {
          taskId,
          appId,
          privateIp: privateIp.value,
        };
      }
    } else {
      logger.error(`Error getting private ip for task: ${task}`);

      return {
        taskId: "",
        appId: "",
        privateIp: "",
      };
    }
  });

  let retries = 0;

  // if any private ip is missing, retry up to 3 times

  while (
    privateIps.some((ip) => !ip.privateIp || ip.privateIp.length === 0) &&
    retries < 3
  ) {
    logger.info("Retrying to get missing private ips");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const missingTaskIds = privateIps
      .filter((ip) => !ip.privateIp)
      .map((ip) => ip.taskId);

    const missingPrivateIps = await getTaskPrivateIps(missingTaskIds);

    privateIps.forEach((ip) => {
      const missingIp = missingPrivateIps.find(
        (missingIp) => missingIp.taskId === ip.taskId,
      );

      if (missingIp) {
        ip.privateIp = missingIp.privateIp;
      }
    });

    retries++;
  }

  return privateIps;
};
