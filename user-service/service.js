import { randomUUID, createHash, randomBytes } from "crypto";
import http from "http-status";
import jwt from "jsonwebtoken";
import { User } from "./model.js";

export class UserService {
  #baseTokenSecret = "";
  constructor(baseTokenSecret) {
    this.#baseTokenSecret = baseTokenSecret;
  }

  async #ensureUserDoesntExist(email) {
    const user = User.findOne({ email });
    if (user) {
      throw http.BAD_REQUEST;
    }
  }

  async #getUserObjectFromToken(userToken) {
    const staleUser = jwt.decode(userToken);
    const user = User.findOne({ email: staleUser.email });
    if (!user) throw http.UNAUTHORIZED;
    return user;
  }

  async createUser({ email, fullName, password }) {
    await this.#ensureUserDoesntExist(email);
    const passwordSalt = createSalt();
    const sessionSalt = createSalt();
    const passwordHash = getSaltedHash(password, passwordSalt);
    const id = randomUUID();

    return User.create({
      _id: id,
      email,
      fullName,
      passwordHash,
      passwordSalt,
      sessionSalt,
    }).save();
  }

  async getUserToken({ email, password }, verify = true) {
    const user = User.findOne({ email });
    if (!user) throw http.UNAUTHORIZED;
    const { passwordHash, passwordSalt, sessionSalt } = user;
    if (verify) {
      const hash = getSaltedHash(password, passwordSalt);
      if (hash !== passwordHash) throw http.UNAUTHORIZED;
    }
    const userObject = User.sanitize(user);

    return jwt.sign(userObject, this.#baseTokenSecret + sessionSalt, {
      expiresIn: "7d",
    });
  }

  async veryifyUserToken(userToken) {
    const user = await this.#getUserObjectFromToken(userToken);
    return new Promise((resolve, reject) => {
      jwt.verify(userToken, this.#baseTokenSecret + user.sessionSalt, (err) => {
        if (err) console.error(err);
        err ? reject(http.UNAUTHORIZED) : resolve(user);
      });
    });
  }

  async revokeAllUserTokens(userToken) {
    const user = await this.veryifyUserToken(userToken);
    user.sessionSalt = createSalt();
    user.save();
  }
}

function createSalt() {
  return randomBytes(16).toString("base64");
}

function getSaltedHash(base, salt) {
  return createHash("sha256")
    .update(base + salt)
    .digest("hex");
}
