import { UserDetailsType } from "./app/contexts/user/UserContext";

type HttpMethod = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";

interface HttpRequestOptions {
  headers?: object;
  auth?: boolean;
  body?: object;
}

interface IRegisterResponse {
  id: string;
  name: string;
  email: string;
  password: string;
  dob: Date | string;
}
interface ISetUserResponse {
  id: string;
  name: string;
  sudokus: object[];
}

export async function HttpRequest<ResponseType>(
  url: string,
  method: HttpMethod,
  { auth, headers, body }: HttpRequestOptions
): Promise<{
  status: number;
  data: ResponseType;
}> {
  const response = await fetch(url, {
    method,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      ...(auth && { Authorization: `Bearer ${getJwt()}` }),
      ...headers,
    },
    ...(body && { body: JSON.stringify(body) }),
  });
  console.log(response);

  const resBody = await response.json();

  if (response.status === 403) {
    window.location.href = "/signin";
  }

  return new Promise((resolve, reject) => {
    if (response.ok) {
      return resolve({ status: 200, data: resBody });
    }
    return reject({ status: response.status, message: resBody.message });
  });
}

const setJwt = (jwt: string): void => {
  localStorage.setItem("accessToken", jwt);
};

const getJwt = (): string | null => {
  return localStorage.getItem("accessToken") || null;
};

const removeJwt = (): void => {
  localStorage.removeItem("accessToken");
};

const getUser = async (): Promise<UserDetailsType> => {
  const user: any = (await HttpRequest('/auth/me', 'GET', { auth: true })).data
  return user
}

export { setJwt, getJwt, removeJwt, getUser };
