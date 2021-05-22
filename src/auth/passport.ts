import passport from "passport";
import passportJWT, { StrategyOptions } from "passport-jwt";
import bcrypt from "bcrypt";
import { VerifyCallback } from "jsonwebtoken";
import User from "../db/user";

const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;
const LocalStrategy = require("passport-local").Strategy;

const LocalStrategyOption = {
  usernameField: "email",
  passwordField: "password",
  session: false,
};

async function localVerify(
  email: string,
  password: string,
  done: any
): Promise<VerifyCallback> {
  let user;
  try {
    user = await User.findByPk(email);

    if (!user) return done(null, false);
    const isSamePassword = await bcrypt.compare(password, user.secret);
    if (!isSamePassword) return done(null, false);
  } catch (e) {
    done(e);
  }
  return done(null, user);
}

const jwtStrategyOption: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY ?? "JWT_SECRET_KEY",
};

async function jwtVerify(payload: any, done: any): Promise<VerifyCallback> {
  let user;
  try {
    user = await User.findByPk(payload.email);
    if (!user) return done(null, false);
  } catch (e) {
    return done(e);
  }
  return done(null, user);
}

export default function () {
  passport.use("local", new LocalStrategy(LocalStrategyOption, localVerify));
  passport.use("jwt", new JWTStrategy(jwtStrategyOption, jwtVerify));
}
