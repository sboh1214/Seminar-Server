import e from "express";
import passport from "passport";
import passportConfig from "./auth/passport";
import bcrypt from "bcrypt";
import AuthRouter from "./auth";
import { Sequelize } from "sequelize";
import User, { initUser } from "./db/user";

const configs = {
  port: 3000,
  database: "postgres",
  username: "postgres",
  password: "password",
  host: "localhost",
};

const app = e();

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(passport.initialize());
passportConfig();

app.get("/", (_: e.Request, res: e.Response) => {
  res.send("Hello World");
});
app.use("/auth", AuthRouter);

const sequelize = new Sequelize(
  configs.database,
  configs.username,
  configs.password,
  {
    host: configs.host,
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

    app.listen(configs.port, () => {
      console.log(`App listening on port ${configs.port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default app;
