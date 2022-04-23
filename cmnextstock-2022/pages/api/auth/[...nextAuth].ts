import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

import { HTTP_METHOD_POST, ACCESS_TOKEN_KEY, HTTP_METHOD_GET } from "@/utils/constant";
import { setCookie, clearCookie } from "@/utils/cookiesUtil";
import httpClient from "@/utils/httpClient";

const signin = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await httpClient.post(`/authen/login`, req.body);

    const { token } = response.data;
    setCookie(res, ACCESS_TOKEN_KEY, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      path: "/",
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(400).end();
  }
};

const signout = async (req: NextApiRequest, res: NextApiResponse) => {
  clearCookie(res, ACCESS_TOKEN_KEY);
  res.json({ result: "ok" });
};

const getSession = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const accessToken = cookies[ACCESS_TOKEN_KEY];
    if (accessToken) {
      const response = await httpClient.get(`/authen/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      res.json(response.data);
    } else {
      res.json({ result: "nok" });
    }
  } catch (error: any) {
    res.json({ result: "nok" });
  }
};

export const checkUnauthorized = (statusCode: number): boolean => {
  return statusCode === 401 || statusCode === 403 || statusCode === 406;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const action = req.query["nextAuth"][0];
  if (req.method === HTTP_METHOD_POST && action === "signin") {
    return signin(req, res);
  } else if (req.method === HTTP_METHOD_GET && action === "signout") {
    return signout(req, res);
  } else if (req.method === HTTP_METHOD_GET && action === "session") {
    return getSession(req, res);
  } else {
    return res.status(405).end(`Error: HTTP ${req.method} is not supported for ${req.url}`);
  }
}
