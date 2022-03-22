import jwtDecode from "jwt-decode";

let accessToken = "";

export const getAccessToken = () => {
  return accessToken;
};

export const setAccessToken = (t: string) => {
  accessToken = t;
};

export const isTokenValid = () => {
  const token = getAccessToken();
  if (!token) {
    return true;
  }
  try {
    const { exp } = jwtDecode(token) as any;
    const isValid = Date.now() >= exp * 1000 ? false : true;
    return isValid;
  } catch {
    return false;
  }
};

export interface AccessTokenPayload {
  ok: boolean;
  accessToken: string;
}

export const fetchAccessToken = () => {
  return fetch("http://localhost:4000/refresh", {
    method: "POST",
    credentials: "include"
  });
};
