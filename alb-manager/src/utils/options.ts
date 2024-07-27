import config from "config";

export enum Models {
  APPS = "apps",
}

export const Config = {
  AWS_ACCESS_KEY: config.get<string>("AWS_ACCESS_KEY"),
  AWS_SECRET_ACCESS_KEY: config.get<string>("AWS_SECRET_ACCESS_KEY"),
  AWS_REGION: config.get<string>("AWS_REGION"),
  ECS_CLUSTER: config.get<string>("ECS_CLUSTER"),
  ALB_ARN: config.get<string>("ALB_ARN"),
  ALB_DNS_NAME: config.get<string>("ALB_DNS_NAME"),
  VPC_ID: config.get<string>("VPC_ID"),
} as const;
