import {
  CreateRuleCommand,
  CreateRuleInput,
  CreateTargetGroupCommand,
  CreateTargetGroupCommandInput,
  RegisterTargetsCommand,
  RegisterTargetsCommandInput,
} from "@aws-sdk/client-elastic-load-balancing-v2";
import elbv2Client from "../aws/elbv2Client";
import { Config } from "./options";

export const createTargetGroup = async (appId: string, port: number) => {
  const params: CreateTargetGroupCommandInput = {
    Name: `tg-${appId.slice(0, 18)}`,
    Protocol: "HTTP",
    Port: port,
    VpcId: Config.VPC_ID,
    TargetType: "ip",
    HealthCheckPath: `/api/${appId}/hc`,
    HealthCheckIntervalSeconds: 60,
    Matcher: {
      HttpCode: "403",
    },
  };

  const command = new CreateTargetGroupCommand(params);
  const response = await elbv2Client.send(command);

  if (!response.TargetGroups || !response.TargetGroups[0].TargetGroupArn) {
    throw new Error("Error creating target group");
  }

  return response.TargetGroups[0].TargetGroupArn;
};

export const registerTargets = async (
  targetGroupArn: string,
  targets: Array<{ Id: string; Port: number }>,
) => {
  const params: RegisterTargetsCommandInput = {
    TargetGroupArn: targetGroupArn,
    Targets: targets,
  };

  const command = new RegisterTargetsCommand(params);
  await elbv2Client.send(command);
};

export const createListenerRule = async (
  albArn: string,
  pathPattern: string,
  targetGroupArn: string,
) => {
  const params: CreateRuleInput = {
    ListenerArn: albArn,
    Conditions: [
      {
        Field: "path-pattern",
        Values: [`${pathPattern}/*`],
      },
    ],
    Actions: [
      {
        Type: "forward",
        TargetGroupArn: targetGroupArn,
      },
    ],
    Priority: generateUniquePriority(),
  };

  const command = new CreateRuleCommand(params);
  await elbv2Client.send(command);
};

const generateUniquePriority = () => {
  return Math.floor(Math.random() * 1000);
};
