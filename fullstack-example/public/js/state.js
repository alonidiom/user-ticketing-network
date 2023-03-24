import { ValueStream } from "/js/vendors/bean.js";

export function getToken() {
  return window.localStorage.getItem("token");
}

async function getUser() {
  const token = getToken();
  const response = await fetch("/api/me", { headers: { "x-token": token } });
  const { ok, user } = await response.json();
  return ok ? user : null;
}

export const state = new ValueStream({
  user: await getUser(),
});

export async function setToken(token) {
  window.localStorage.setItem("token", token);
  await refereseUser();
}

export async function refereseUser() {
  const user = await getUser();
  if (!user) {
    window.localStorage.removeItem("token");
  }
  state.update((current) => ({ ...current, user }));
}
