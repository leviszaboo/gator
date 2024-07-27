import { getAppsByStatus, updateApp } from "../service/app.service";
import { getTaskPrivateIps } from "./ecs.utils";
import {
  createListenerRule,
  createTargetGroup,
  registerTargets,
} from "./elbv2.utils";
import { Config } from "./options";
import logger from "./logger";

export const urlServiceLoop = async (): Promise<void> => {
  while (true) {
    // sleep for 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // get all apps with status 'published'
    const apps = await getAppsByStatus("published");

    const taskIds = apps.map((app) => {
      if (app.taskId) {
        return app.taskId;
      }
    });

    if (!taskIds || taskIds.length === 0) {
      continue;
    }

    const privateIps = await getTaskPrivateIps(taskIds as string[]);

    if (!privateIps || privateIps.length === 0) {
      continue;
    }

    privateIps.forEach(async ({ taskId, privateIp, appId }) => {
      const targetGroupArn = await createTargetGroup(appId, 80);

      await registerTargets(targetGroupArn, [
        {
          Id: privateIp,
          Port: 80,
        },
      ]);

      const path = `/api/${appId}`;
      const albArn = Config.ALB_ARN;
      const albDnsName = Config.ALB_DNS_NAME;

      await createListenerRule(albArn, path, targetGroupArn);

      logger.info(`Listener rule created for task: ${taskId}`);
      logger.info(`App updated with URL: http://${albDnsName}${path}`);

      await updateApp({
        appId,
        status: "active",
        url: `http://${albDnsName}${path}`,
      });
    });
  }
};
