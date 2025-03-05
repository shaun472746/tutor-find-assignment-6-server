import app from "./app";
import config from "./app/config";
import mongoose from "mongoose";

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string, { autoIndex: true });

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

bootstrap();