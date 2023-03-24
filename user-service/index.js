import fastify from "fastify";
import { config } from "dotenv";
import http from "http-status";
import { UserService } from "./service.js";

config();

const usersService = new UserService(process.env.BASE_SECRET);
const app = fastify({ logger: true });

app.post("/", async function createUser(req) {
  const { email, password, fullName } = req.body;
  await usersService.createUser({ email, fullName, password });
  const token = await usersService.getUserToken({ email, password }, false);

  return { ok: true, token };
});

app.get("/", async function (req) {
  const { token, email, password } = req.query;
  if (token) {
    await usersService.veryifyUserToken(token);
    return { ok: true, token };
  }

  return {
    ok: true,
    token: await usersService.getUserToken({ email, password }),
  };
});

app.delete("/", async function (req) {
  const { token } = req.query;

  await usersService.revokeAllUserTokens(token);

  return { ok: true };
});

app.setErrorHandler(function (error, _request, reply) {
  this.log.error(Number.isInteger(error) ? http[error] : error);
  reply
    .status(Number.isInteger(error) ? error : http.INTERNAL_SERVER_ERROR)
    .send({ ok: false });
});

app.listen({ port: +process.env.PORT }, () =>
  console.log("Users service is up")
);
