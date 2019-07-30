const express = require("express");
const app = express();
// const morgan = require("morgan");
app.mongoose = require("mongoose");

app.use(express.json({ extended: true })); // to support JSON-encoded bodies
// app.use(morgan("dev"));

const NODE_ENV = process.env.NODE_ENV.trim() || "dev"; // ten trim jest po chuj
const { MONGO_PASSWD } = process.env
const config = {
  mongoDBPath: `mongodb://personal_dashboard_tai:kreatywnehaslo123@ds147265.mlab.com:47265/heroku_zqj4r0x0`,
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
    start_app(app);
  })
  .catch(err => {
    console.log("[ERROR] Error while connecting to MONGODB instance." + err);
  });

//Middlewares
app.middlewares = require("./middlewares")(app);
//Models
app.model = require("./models")(app);
//Routes
app.use("/api", require("./api")(app));

const revokeTokens = app => {
  console.log("[INFO] Scheduled token removal is in progress");
  app.model.token
    .deleteMany({
      valid_to: { $lt: new Date(Date.now()) }
    })
    .exec((error, _) => {
      if (error)
        console.log(
          "[ERROR] Something went wrong with execution of scheduled token removal"
        );
    });
};
const start_app = app => {
  setInterval(() => {
    revokeTokens(app);
  }, 60000 * app.config.SESS_TIMEOUT);

  app.listen(config.APP_PORT, () => {
    console.log(`App is listening on port ${config.APP_PORT}`);
  });
};
