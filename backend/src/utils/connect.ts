import Mongoose from "mongoose";
import config from "config";
import log from "./logger";

async function connect() {
  const dbUri = config.get<string>("dbUri");
  try {
    await Mongoose.connect(dbUri);
    log.info("DB conected");
  } catch (err: any) {
    log.error("Cant connect to the database");
    console.log(err.message);
    process.exit(1);
  }
}

export default connect;
