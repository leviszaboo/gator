import express from "express";
import cors from "cors";
import config from "config";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { deserializeUser } from "./middleware/deserializeUser";
import logger from "./utils/logger";

const port = config.get<number>("port");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(deserializeUser);

app.listen(port, () => {
    logger.info(`App is running on http://localhost:${port}`);

    routes(app);
})