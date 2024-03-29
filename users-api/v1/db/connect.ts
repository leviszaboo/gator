import mysql from "mysql2";
import config from "config";

const pool = mysql
  .createPool({
    host: config.get<string>("DB.dbHost"),
    user: config.get<string>("DB.dbUser"),
    password: config.get<string>("DB.dbPassword"),
    database: config.get<string>("DB.dbName"),
  })
  .promise();

export default pool;
