import e from "express";
import bcrypt from "bcrypt";
import AuthRouter from "./routes/auth";
import { Sequelize } from "sequelize";
import User, { initUser } from "./db/user";
import {Configs} from "./configs";

const app = e();

app.use(e.json());
app.use(e.urlencoded({ extended: true }));

app.get("/", (_: e.Request, res: e.Response) => {
  res.send("Hello World");
});
app.use("/auth", AuthRouter);

const sequelize = new Sequelize(
  Configs.database,
  Configs.username,
  Configs.password,
  {
    host: Configs.host,
    dialect: "postgres",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");

    initUser(sequelize);

    if (true) {
      User.sync({ force: true }).then(() => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync("admin", salt);

        User.create({ email: "admin", secret: hash, isAdmin: true });
      });
    }

    app.listen(Configs.port, () => {
      console.log(`App listening on port ${Configs.port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default app;
