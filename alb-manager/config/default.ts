import "dotenv/config";

export default {
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  ECS_CLUSTER: process.env.ECS_CLUSTER,
  TASK_DEFINITION: process.env.TASK_DEFINITION,
  ALB_ARN: process.env.ALB_ARN,
  ALB_DNS_NAME: process.env.ALB_DNS_NAME,
  VPC_ID: process.env.VPC_ID,
};
