import { GetSession, SignIn, SignUp } from "@/models/auth.model";
import { ProductData } from "@/models/product.model";
import { UserData } from "@/models/user.model";
import httpClient from "@/utils/httpClient";

type signUpProps = {
  username: string;
  password: string;
};
export const signUp = async (user: signUpProps): Promise<SignUp> => {
  const { data: response } = await httpClient.post<SignUp>(`/authen/register`, user);
  return response;
};

type signInProps = {
  username: string;
  password: string;
};
export const signIn = async (user: signInProps): Promise<SignIn> => {
  const { data: response } = await httpClient.post<SignIn>(`/auth/signin`, user, {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
  });
  return response;
};

export const getSession = async (): Promise<GetSession> => {
  const response = await httpClient.get(`/auth/session`, {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
  });

  return response.data;
};

export const signOut = async (): Promise<void> => {
  const response = await httpClient.get(`/auth/signout`, {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
  });
  return response.data;
};

export const getProducts = async (keyword?: string): Promise<ProductData[]> => {
  if (keyword) {
    return (await httpClient.get(`/stock/product/keyword/${keyword}`)).data;
  } else {
    return (await httpClient.get(`/stock/product`)).data;
  }
};

export const doGetStockById = async (id: string) => {
  const response = await httpClient.get(`/stock/product/${id}`);
  return response.data;
};

export const addProduct = async (data: FormData): Promise<void> => {
  await httpClient.post(`/stock/product`, data);
};

export const editProduct = async (data: FormData): Promise<void> => {
  await httpClient.put(`/stock/product`, data);
};

export const deleteProduct = async (id?: string): Promise<void> => {
  await httpClient.delete(`/stock/product/${id}`);
};
