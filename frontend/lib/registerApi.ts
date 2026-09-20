import api from "./api";


export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}


export async function registerUser(
  data: RegisterData
) {
  const response = await api.post(
    "/auth/register/",
    data
  );

  return response.data;
}