const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");

const DATABASE = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DATABASE)
  .then(() => console.log("Mongo is connected"))
  .catch((err) => console.log(err.name, err.message));

app.listen(3000, () => {
  console.log("The server is live on port 3000");
});
