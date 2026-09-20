import api from "./api";

export interface LoginResponse {
  access: string;
  refresh: string;
}

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/login/",
    {
      username,
      password,
    }
  );

  return response.data;
}