import { extractData } from "./util";

export const loginApi = async (credentials: Credentials): Promise<LoginResponse> =>
  extractData(fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }));

export const logoutApi = async (accessToken: string) =>
  fetch(`/api/v1/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': accessToken
    }
  }
  )
