import { ElasticLoadBalancingV2Client } from "@aws-sdk/client-elastic-load-balancing-v2";
import { Config } from "../utils/options";

const elbv2Client = new ElasticLoadBalancingV2Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: Config.AWS_ACCESS_KEY,
    secretAccessKey: Config.AWS_SECRET_ACCESS_KEY,
  },
});

export default elbv2Client;
