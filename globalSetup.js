import * as dotenv from "dotenv";
import path from "path";

export default () => {
  dotenv.config({
    path: path.resolve(process.cwd(), process.env.ENV_FILE || ".env")
  });
};