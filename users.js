export class UsersSDK {
  #url = null;
  #decoder = null;
  constructor(serviceUrl, jwtDecoder) {
    this.#url = serviceUrl;
    this.#decoder = jwtDecoder;
  }

  async signup({ email, password, fullName }) {
    const response = await fetch(this.#url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, fullName }),
    });
    if (!response.ok) {
      throw response.status;
    }
    const { ok, token } = await response.json();
    if (!ok) throw new Error("???");
    return token;
  }

  async login({ email, password }) {
    const url = new URL(this.#url);
    url.searchParams.append("email", email);
    url.searchParams.append("password", password);
    const response = await fetch(url.href);
    if (!response.ok) {
      throw response.status;
    }
    const { ok, token } = await response.json();
    if (!ok) throw new Error("???");
    return token;
  }

  async getUser({ token }) {
    const url = new URL(this.#url);
    url.searchParams.append("token", token);
    const response = await fetch(url.href);
    if (!response.ok) {
      throw response.status;
    }
    const { ok, token: validatedToken } = await response.json();
    if (!ok) throw new Error("???");
    return this.#decoder(validatedToken);
  }

  async logout({ token }) {
    const url = new URL(this.#url);
    url.searchParams.append("token", token);
    const response = await fetch(url.href, { method: "DELETE" });
    if (!response.ok) {
      throw response.status;
    }
    const { ok } = await response.json();
    if (!ok) throw new Error("???");
  }
}
