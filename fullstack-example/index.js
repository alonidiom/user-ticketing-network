import * as path from "path";
import * as url from "url";
import fastify from "fastify";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import http from "http-status";
import cookie from "cookie";
import fastifyStatic from "@fastify/static";

config();

const app = fastify({ logger: true });
app.register(fastifyStatic, {
  root: path.join(url.fileURLToPath(new URL(".", import.meta.url)), "public"),
});
app.addHook("onRequest", async function (request, reply) {
  const token = request.headers["x-token"];
  if (token) {
    request.user = jwt.decode(token);
  }
});

app.get("/api/me", async (req, rep) => {
  const proxy = await fetch(process.env.SSR_EXAMPLE + "/api/me", {
    headers: {
      cookie: cookie.serialize("user", req.headers["x-token"]),
    },
  });

  const data = await proxy.json();

  rep.status(proxy.status);

  return data;
});

app.get("/api/logout", async (req, rep) => {
  const proxy = await fetch(process.env.SSR_EXAMPLE + "/logout", {
    method: "post",
    headers: {
      cookie: cookie.serialize("user", req.headers["x-token"]),
    },
  });

  const data = await proxy.json();

  rep.status(proxy.status);

  return data;
});

app.post("/api/create-token", async (req, rep) => {
  const proxy = await fetch(process.env.SSR_EXAMPLE + "/login", {
    redirect: "manual",
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  });
  if (!proxy.status >= 400) {
    rep.status(proxy.status);
    return { ok: false };
  }
  const cookies = proxy.headers.get("set-cookie");
  const { user } = cookie.parse(cookies);

  return { token: user, ok: true };
});

app.setNotFoundHandler((req, res) => {
  if (req.raw.url && req.raw.url.startsWith("/api")) {
    return res.status(http.NOT_FOUND).send({
      success: false,
      error: {
        kind: "user_input",
        message: "Not Found",
      },
    });
  }

  return res.status(http.OK).sendFile("index.html");
});

app.setErrorHandler(function (error, _request, reply) {
  this.log.error(Number.isInteger(error) ? http[error] : error);
  reply
    .status(Number.isInteger(error) ? error : http.INTERNAL_SERVER_ERROR)
    .send({ ok: false });
});

app.listen({ port: +process.env.PORT }, () =>
  console.log("Fuul Stack Proxy is up")
);
