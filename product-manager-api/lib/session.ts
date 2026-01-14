import {
  getIronSession,
  type IronSessionData,
  type SessionOptions,
} from "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    user?: { id: string; role: "admin" };
  }
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "pm_admin",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true,
    path: "/",
  },
};

export function getSession(req: Request, res: Response) {
  return getIronSession<IronSessionData>(
    req as any,
    res as any,
    sessionOptions
  );
}
