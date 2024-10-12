const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("uncaught exception");
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DATABASE = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DATABASE)
  .then(() => console.log("Mongo is connected"))
  .catch((err) => console.log(err.name, err.message));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`The server is live on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
