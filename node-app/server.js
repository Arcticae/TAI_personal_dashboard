const utils = require("./utils");

const express = require("express");
const schedule = require("node-schedule");
const app = express();
app.mongoose = require("mongoose");
const multer = require("multer");

app.use(express.json({ extended: true })); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support some other shit

const config = {
  mongoDBPath: `mongodb://${
    process.env.NODE_ENV === "dev" ? "localhost" : "mongodb"
  }:27017/node-app-db`,
  SESS_TIMEOUT: 10,
  APP_PORT: 6969,
  dbConnectionOptions: {
    useNewUrlParser: true,
    autoIndex: process.env.NODE_ENV === "dev",
    reconnectInterval: 1000 //miliseconds
  }
};

app.config = config;
app.mongoose
  .connect(app.config.mongoDBPath, app.config.dbConnectionOptions)
  .then(() => {
    start_app();
  })
  .catch(err => {
    console.log("[ERROR] Error while connecting to MONGODB instance." + err);
  });

//Middlewares
app.middlewares = require("./middlewares")(app);
app.middlewares.upload = multer();
//Models
app.model = require("./models")(app);
app.use("/api", require("./api")(app));

function start_app() {
  //TODO: move scheduled jobs somewhere?
  //schedule some jobs here, like automatic removing revoked tokens from db
  schedule.scheduleJob(` */${app.config.SESS_TIMEOUT} * * * * `, () => {
    console.log("[INFO] Scheduled revoked tokens removal is in process");

    app.model.auth.token
      .deleteMany({
        valid_to: { $lt: new Date(Date.now()) }
      })
      .exec((error, _) => {
        if (error)
          console.log(
            "[ERROR] Something went wrong with execution of scheduled token removal"
          );
      });
  });

  app.listen(config.APP_PORT, () => {
    console.log(`App is listening on port ${config.APP_PORT}`);
  });
}
