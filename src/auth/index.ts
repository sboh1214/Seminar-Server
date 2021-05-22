import e from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { compareSync } from "bcrypt";
import User from "../db/user";

const router = e.Router();

router.post("/signin", (req: e.Request, res: e.Response) => {
  const { email, password } = req.body;

  User.findByPk(email)
    .then((user: User | null) => {
      console.log(user);
      if (!user) return res.status(400).send("There is no such user");

      const isSamePassword = compareSync(password, user.secret);
      if (!isSamePassword) return res.status(400).send("Wrong Password");
      return res.json(createToken(email));
    })
    .catch(() => {
      return res.status(500).send("DB Error");
    });
});

router.get(
  "/refresh",
  (req: e.Request, res: e.Response, next: e.NextFunction) => {
    authAndRes("jwt", req, res, next);
  }
);

function createToken(email: string) {
  const accessToken = jwt.sign(
    {
      email: email,
    },
    process.env.JWT_SECRET_KEY ?? "JWT_SECRET_KEY",
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign(
    {
      email: email,
    },
    process.env.JWT_SECRET_KEY ?? "JWT_SECRET_KEY",
    { expiresIn: "2week" }
  );
  return { accessToken, refreshToken };
}

function authAndRes(
  type: string,
  req: e.Request,
  res: e.Response,
  next: e.NextFunction
) {
  passport.authenticate(type, { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: info ?? "error" });
    }
    if (!user) {
      return res.status(400).json({ message: "No such email" });
    }
    const accessToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET_KEY ?? "JWT_SECRET_KEY",
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET_KEY ?? "JWT_SECRET_KEY",
      { expiresIn: "2week" }
    );
    return res.json({ accessToken, refreshToken });
  })(req, res, next);
}

export default router;
