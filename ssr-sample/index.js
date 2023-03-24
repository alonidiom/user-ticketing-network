import fastify from "fastify";
import { config } from "dotenv";
import ejs from "ejs";
import jwt from "jsonwebtoken";
import http from "http-status";
import fastifyView from "@fastify/view";
import fastifyForms from "@fastify/formbody";
import fastifyCookie from "@fastify/cookie";
import { UsersSDK } from "../users.js";

config();

const users = new UsersSDK(process.env.USER_SERVICE_URL, jwt.decode);

const app = fastify({ logger: true });
app.register(fastifyView, { engine: { ejs } });
app.register(fastifyForms);
app.register(fastifyCookie, { secret: process.env.SECRET });
app.addHook("onRequest", async function (request) {
  const token = request.cookies.user;
  if (token) {
    try {
      request.user = await users.getUser({ token });
    } catch (error) {
      reply.clearCookie("user");
    }
  }
});

app.post("/login", async (req, reply) => {
  try {
    const token = await users.login({
      email: req.body.email,
      password: req.body.password,
    });
    reply.cookie("user", token);
    return reply.redirect(http.SEE_OTHER, "/");
  } catch (error) {
    if (Number.isInteger(error)) {
      reply.status(error);
    }
    return reply.view("./views/login.ejs", {
      error: error === http.UNAUTHORIZED ? "Bad email or password" : "???",
    });
  }
});

app.get("/login", (req, reply) => {
  if (req.user) {
    return reply.redirect(http.FOUND, "/");
  }
  return reply.view("./views/login.ejs", { error: null });
});

app.post("/signup", async (req, reply) => {
  try {
    const token = await users.signup({
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.fullName,
    });
    reply.cookie("user", token);
    return reply.redirect(http.SEE_OTHER, "/");
  } catch (error) {
    return reply.view("./views/signup.ejs", {
      error: "???",
    });
  }
});

app.get("/signup", (req, reply) => {
  if (req.user) {
    return reply.redirect(http.FOUND, "/");
  }
  return reply.view("./views/signup.ejs", { error: null });
});

app.post("/logout", async (req, reply) => {
  await users.logout({ token: req.cookies.user });
  reply.clearCookie("user");
  return reply.redirect(http.SEE_OTHER, "/login");
});

app.get("/", (req, reply) => {
  if (!req.user) {
    return reply.redirect(http.FOUND, "/login");
  }
  return reply.view("./views/index.ejs", { user: req.user });
});

app.setErrorHandler(function (error, _request, reply) {
  this.log.error(Number.isInteger(error) ? http[error] : error);
  reply
    .status(Number.isInteger(error) ? error : http.INTERNAL_SERVER_ERROR)
    .send({ ok: false });
});

app.listen({ port: +process.env.PORT }, () => console.log("SSR Sample is up"));
